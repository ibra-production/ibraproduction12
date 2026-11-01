import {
  collection,
  doc,
  getDocs,
  runTransaction,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import {
  normalizePhone,
  phonesMatch,
  stableClientCode,
} from "../utils/clientIdentity";

type BookingForClientLink = {
  id: string;
  groomName: string;
  brideName: string;
  phone: string;
  email?: string;
  venue?: string;
  eventDate?: string;
  eventDates?: string[];
  status?: string;
  clientId?: string;
  clientCode?: string;
};

function createdAtMillis(value: unknown): number {
  if (
    value &&
    typeof value === "object" &&
    "toMillis" in value &&
    typeof value.toMillis === "function"
  ) {
    return value.toMillis();
  }
  return Number.MAX_SAFE_INTEGER;
}

export async function linkBookingsToClients(
  firestore: Firestore,
  bookings: BookingForClientLink[]
): Promise<void> {
  const pending = bookings.filter(
    (booking) => !booking.clientId || !booking.clientCode
  );
  if (pending.length === 0) return;

  const clients = (await getDocs(collection(firestore, "clients"))).docs;
  const orderedClients = [...clients].sort((first, second) => {
    const timeDifference =
      createdAtMillis(first.data().createdAt) -
      createdAtMillis(second.data().createdAt);
    return timeDifference || first.id.localeCompare(second.id);
  });

  for (const booking of pending) {
    const normalizedPhone = normalizePhone(booking.phone);
    if (!normalizedPhone) {
      throw new Error(`Booking ${booking.id} has no usable phone number.`);
    }

    const matchingClient = orderedClients.find((client) =>
      phonesMatch(String(client.data().phone || ""), booking.phone)
    );
    const matchingClientByCode = orderedClients.find((client) => {
      const data = client.data();
      return (
        client.id === booking.clientId ||
        data.clientCode === booking.clientCode ||
        data.barcode === booking.clientCode
      );
    });
    const existing = booking.clientId
      ? orderedClients.find((client) => client.id === booking.clientId) ||
        matchingClientByCode ||
        matchingClient
      : matchingClientByCode || matchingClient;
    const phoneIdentity = await stableClientCode(booking.phone);
    const proposedCode = existing
      ? String(existing.data().clientCode || existing.data().barcode || existing.id)
      : phoneIdentity;
    const proposedClientId = existing?.id || proposedCode;

    const bookingRef = doc(firestore, "bookings", booking.id);
    const linkRef = doc(firestore, "bookingClientLinks", booking.id);
    const phoneIndexRef = doc(firestore, "clientPhoneIndex", phoneIdentity);

    await runTransaction(firestore, async (transaction) => {
      const [linkSnapshot, bookingSnapshot, phoneIndexSnapshot] =
        await Promise.all([
          transaction.get(linkRef),
          transaction.get(bookingRef),
          transaction.get(phoneIndexRef),
        ]);
      if (!bookingSnapshot.exists()) return;

      const currentBooking = bookingSnapshot.data();
      if (currentBooking.clientId && currentBooking.clientCode) return;
      if (
        phoneIndexSnapshot.exists() &&
        (phoneIndexSnapshot.data().normalizedPhone !== normalizedPhone ||
          typeof phoneIndexSnapshot.data().clientId !== "string" ||
          !phoneIndexSnapshot.data().clientId)
      ) {
        throw new Error(`Phone identity index is inconsistent for booking ${booking.id}.`);
      }

      if (linkSnapshot.exists()) {
        const savedLink = linkSnapshot.data();
        const patch: Record<string, string> = {};
        if (!currentBooking.clientId && savedLink.clientId) {
          patch.clientId = savedLink.clientId;
        }
        if (!currentBooking.clientCode && savedLink.clientCode) {
          patch.clientCode = savedLink.clientCode;
        }
        if (Object.keys(patch).length > 0) {
          transaction.update(bookingRef, patch);
        }
        if (!phoneIndexSnapshot.exists() && savedLink.clientId) {
          transaction.set(phoneIndexRef, {
            clientId: savedLink.clientId,
            normalizedPhone,
            createdAt: serverTimestamp(),
          });
        }
        return;
      }

      const indexedClientId = phoneIndexSnapshot.data()?.clientId;
      const clientId =
        currentBooking.clientId ||
        indexedClientId ||
        proposedClientId;
      const clientRef = doc(firestore, "clients", clientId);
      const clientSnapshot = await transaction.get(clientRef);
      const currentClient = clientSnapshot.data() || {};
      const clientCode = String(
        currentBooking.clientCode ||
          currentClient.clientCode ||
          currentClient.barcode ||
          (clientSnapshot.exists() ? clientId : proposedCode)
      );
      const projectCount = Number(currentClient.totalProjects || 0);
      const alreadyCounted = currentClient.lastBookingId === booking.id;

      transaction.set(
        clientRef,
        {
          clientCode,
          barcode: currentClient.barcode || clientCode,
          fullName: currentClient.fullName || booking.groomName,
          groomName: currentClient.groomName || booking.groomName,
          brideName: currentClient.brideName || booking.brideName,
          phone: currentClient.phone || booking.phone,
          email: currentClient.email || booking.email || "",
          address: currentClient.address || booking.venue || "",
          active: currentClient.active ?? true,
          totalProjects: projectCount + (alreadyCounted ? 0 : 1),
          lastBookingId: booking.id,
          lastEventDates: booking.eventDates?.length
            ? booking.eventDates
            : booking.eventDate
              ? [booking.eventDate]
              : [],
          lastStatus: currentBooking.status || booking.status || "new",
          createdAt: currentClient.createdAt || serverTimestamp(),
          updatedAt: serverTimestamp(),
          source: currentClient.source || "booking",
        },
        { merge: true }
      );
      if (!phoneIndexSnapshot.exists()) {
        transaction.set(phoneIndexRef, {
          clientId,
          normalizedPhone,
          createdAt: serverTimestamp(),
        });
      }
      transaction.update(bookingRef, {
        clientId,
        clientCode,
      });
      transaction.set(linkRef, {
        clientId,
        clientCode,
        createdAt: serverTimestamp(),
      });
    });
  }
}

export type { BookingForClientLink };
