import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { after, before, beforeEach, test } from "node:test";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { linkBookingsToClients } from "../src/firebase/bookingClientLinker.ts";

const projectId = "demo-ibra-production-web-rules";
let testEnvironment;

const validBooking = (overrides = {}) => ({
  groomName: "Test Groom",
  brideName: "Test Bride",
  phone: "+213 555 123 456",
  email: "groom@example.com",
  eventType: "Wedding",
  eventDate: "2026-12-01",
  eventDates: ["2026-12-01"],
  eventTime: "17:45 (after sunset)",
  wilaya: "Alger",
  venue: "Test Hall",
  serviceId: "photo",
  packageId: "royal",
  notes: "",
  idCardUrl: "https://example.invalid/id.jpg",
  idCardName: "identity.jpg",
  status: "new",
  createdAt: new Date(),
  ...overrides,
});

before(async () => {
  testEnvironment = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: await readFile(
        new URL("../firestore.rules.proposed", import.meta.url),
        "utf8"
      ),
    },
  });
});

beforeEach(async () => {
  await testEnvironment.clearFirestore();
});

after(async () => {
  await testEnvironment?.cleanup();
});

test("public users can create new bookings only and cannot read clients or update bookings", async () => {
  const guestDb = testEnvironment.unauthenticatedContext().firestore();
  const bookingRef = doc(guestDb, "bookings", "public-booking");

  await assertSucceeds(setDoc(bookingRef, validBooking()));
  await assertFails(
    setDoc(doc(guestDb, "bookings", "non-new-booking"), validBooking({ status: "confirmed" }))
  );
  await assertFails(updateDoc(bookingRef, { status: "confirmed" }));
  await assertFails(getDoc(doc(guestDb, "clients", "private-client")));
  await assertFails(
    getDoc(doc(guestDb, "bookingClientLinks", "public-booking"))
  );
  await assertFails(
    setDoc(doc(guestDb, "bookings", "forged-link"), validBooking({ clientId: "private-client" }))
  );
  await assertFails(
    setDoc(doc(guestDb, "bookings", "forged-code"), validBooking({ clientCode: "FORGED" }))
  );
  await assertFails(
    setDoc(doc(guestDb, "bookings", "invalid-time"), validBooking({ eventTime: 1745 }))
  );
  await assertFails(
    updateDoc(bookingRef, { eventTime: "changed" })
  );
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "clientPortals", "known-portal-code"), {
      status: "confirmed",
    });
  });
  await assertSucceeds(getDoc(doc(guestDb, "clientPortals", "known-portal-code")));
  await assertFails(getDocs(collection(guestDb, "clientPortals")));
});

test("authenticated users without admin claim cannot access admin data", async () => {
  const ordinaryDb = testEnvironment
    .authenticatedContext("ordinary-user", { email: "user@example.com" })
    .firestore();

  await assertSucceeds(
    setDoc(doc(ordinaryDb, "bookings", "ordinary-public-booking"), validBooking())
  );
  await assertFails(getDoc(doc(ordinaryDb, "clients", "private-client")));
  await assertFails(getDocs(collection(ordinaryDb, "clients")));
  await assertFails(getDoc(doc(ordinaryDb, "bookings", "public-booking")));
  await assertFails(
    setDoc(doc(ordinaryDb, "clients", "forbidden-client"), { phone: "213555123456" })
  );
  await assertFails(
    setDoc(doc(ordinaryDb, "clientPhoneIndex", "IBRA-C-TEST"), {
      clientId: "forbidden-client",
      normalizedPhone: "213555123456",
    })
  );
  await assertFails(
    updateDoc(doc(ordinaryDb, "bookings", "ordinary-public-booking"), {
      status: "confirmed",
    })
  );
  await assertFails(
    setDoc(doc(ordinaryDb, "bookingWorkflows", "ordinary-workflow"), {})
  );
});

test("admin custom claim grants booking and client management", async () => {
  const adminDb = testEnvironment
    .authenticatedContext("verified-admin", {
      admin: true,
      email: "admin@ibraprod.online",
      email_verified: true,
    })
    .firestore();

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), "bookings", "admin-managed"), validBooking());
  });

  await assertSucceeds(
    updateDoc(doc(adminDb, "bookings", "admin-managed"), { status: "confirmed" })
  );
  await assertFails(
    updateDoc(doc(adminDb, "bookings", "admin-managed"), { status: "approved" })
  );
  await assertSucceeds(
    setDoc(doc(adminDb, "clients", "admin-client"), {
      clientCode: "IBRA-C-TEST",
      barcode: "IBRA-C-TEST",
      phone: "213555123456",
    })
  );
  await assertSucceeds(getDoc(doc(adminDb, "clients", "admin-client")));
  await assertSucceeds(
    setDoc(doc(adminDb, "clientPhoneIndex", "IBRA-C-TEST"), {
      clientId: "admin-client",
      normalizedPhone: "213555123456",
    })
  );
  await assertSucceeds(
    setDoc(doc(adminDb, "bookingWorkflows", "admin-workflow"), {
      status: "ready",
    })
  );
});

test("booking reconciliation reuses an existing formatted-phone client and is idempotent", async () => {
  const adminDb = testEnvironment
    .authenticatedContext("linker-admin", { admin: true })
    .firestore();

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const seedDb = context.firestore();
    await setDoc(doc(seedDb, "clients", "legacy-client-id"), {
      clientCode: "LEGACY-CODE",
      barcode: "LEGACY-BARCODE",
      phone: "(213) 555-123-456",
      totalProjects: 2,
      createdAt: new Date(2024, 0, 1),
    });
    await setDoc(
      doc(seedDb, "bookings", "formatted-phone-booking"),
      validBooking()
    );
  });

  await linkBookingsToClients(adminDb, [
    {
      id: "formatted-phone-booking",
      groomName: "Test Groom",
      brideName: "Test Bride",
      phone: "+213 555 123 456",
      eventDate: "2026-12-01",
      eventDates: ["2026-12-01"],
      status: "new",
    },
  ]);
  await updateDoc(doc(adminDb, "bookings", "formatted-phone-booking"), {
    clientCode: "",
  });
  await linkBookingsToClients(adminDb, [
    {
      id: "formatted-phone-booking",
      groomName: "Test Groom",
      brideName: "Test Bride",
      phone: "+213 555 123 456",
      eventDate: "2026-12-01",
      eventDates: ["2026-12-01"],
      status: "new",
    },
  ]);

  const booking = await getDoc(doc(adminDb, "bookings", "formatted-phone-booking"));
  const clients = await getDocs(collection(adminDb, "clients"));
  assert.equal(booking.data().clientId, "legacy-client-id");
  assert.equal(booking.data().clientCode, "LEGACY-CODE");
  assert.equal(clients.size, 1);
  assert.equal(clients.docs[0].data().barcode, "LEGACY-BARCODE");
  assert.equal(clients.docs[0].data().totalProjects, 3);
  const phoneIndex = await getDoc(
    doc(adminDb, "clientPhoneIndex", "IBRA-C-57BC2227C5CF190B")
  );
  assert.equal(phoneIndex.data().clientId, "legacy-client-id");
});

test("concurrent bookings for a new formatted phone share one client document", async () => {
  const adminDb = testEnvironment
    .authenticatedContext("concurrent-linker-admin", { admin: true })
    .firestore();

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const seedDb = context.firestore();
    await setDoc(
      doc(seedDb, "bookings", "new-client-booking-1"),
      validBooking({ phone: "+213 555 123 987" })
    );
    await setDoc(
      doc(seedDb, "bookings", "new-client-booking-2"),
      validBooking({ phone: "213-555-123-987" })
    );
  });

  const bookings = [
    {
      id: "new-client-booking-1",
      groomName: "Test Groom",
      brideName: "Test Bride",
      phone: "+213 555 123 987",
      eventDate: "2026-12-01",
      status: "new",
    },
    {
      id: "new-client-booking-2",
      groomName: "Test Groom",
      brideName: "Test Bride",
      phone: "213-555-123-987",
      eventDate: "2026-12-02",
      status: "new",
    },
  ];

  await Promise.all([
    linkBookingsToClients(adminDb, bookings),
    linkBookingsToClients(adminDb, bookings),
  ]);

  const clients = await getDocs(collection(adminDb, "clients"));
  assert.equal(clients.size, 1);
  assert.equal(clients.docs[0].data().totalProjects, 2);
  const index = await getDoc(
    doc(adminDb, "clientPhoneIndex", "IBRA-C-F7574B112C15E7EE")
  );
  assert.ok(index.exists());
  assert.equal(index.data().clientId, clients.docs[0].id);
});
