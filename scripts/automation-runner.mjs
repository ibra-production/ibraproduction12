import admin from "firebase-admin";
import twilio from "twilio";

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!serviceAccountJson) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON");

if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(JSON.parse(serviceAccountJson)) });

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

let sent = 0, failed = 0, waiting = 0, pushSent = 0, newBookings = 0;

// =========================================================
// NEW BOOKING PHONE NOTIFICATION
// Sends a Firebase push notification to every active admin device.
// The booking is marked after processing so the notification is idempotent.
// =========================================================
const newBookingSnapshot = await db.collection("bookings")
  .where("status", "==", "new")
  .limit(50)
  .get();

const tokenSnapshot = await db.collection("pushTokens")
  .where("active", "==", true)
  .limit(100)
  .get();

const tokens = tokenSnapshot.docs.map(d => d.id).filter(Boolean);

for (const bookingDoc of newBookingSnapshot.docs) {
  const booking = bookingDoc.data();
  if (booking.ownerNotifiedAt) continue;

  const title = "Ibra Production — حجز جديد";
  const body = `حجز جديد: ${booking.groomName || "عميل"}${booking.brideName ? " × " + booking.brideName : ""} • ${booking.eventDate || "بدون تاريخ"} • ${booking.eventTime || "بدون وقت"}`;

  if (tokens.length) {
    try {
      const result = await admin.messaging().sendEachForMulticast({
        tokens,
        notification: { title, body },
        data: {
          type: "new_booking",
          bookingId: String(bookingDoc.id),
          url: "/"
        },
        webpush: {
          notification: {
            title,
            body,
            icon: "https://ibraprod.online/logo.jpg",
            badge: "https://ibraprod.online/logo.jpg"
          },
          fcmOptions: { link: "https://ibraprod.online/" }
        }
      });
      pushSent += result.successCount;
    } catch (error) {
      console.error("FCM new booking error:", error);
    }
  }

  await bookingDoc.ref.update({
    ownerNotifiedAt: FieldValue.serverTimestamp(),
    ownerNotifiedChannels: { push: tokens.length > 0 },
    ownerNotificationText: body
  });
  newBookings++;
}

// =========================================================
// AUTOMATION QUEUE
// =========================================================
const snapshot = await db.collection("automationQueue")
  .where("status", "==", "queued")
  .limit(50)
  .get();

const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_PHONE_NUMBER;
const smsReady = Boolean(sid && token && from);
const sms = smsReady ? twilio(sid, token) : null;

for (const item of snapshot.docs) {
  const data = item.data();

  if (data.type === "whatsapp_manual") {
    await item.ref.update({ status: "ready", processor: "github-actions", processedAt: FieldValue.serverTimestamp() });
    continue;
  }

  if (!["status_change", "event_reminder", "payment_due"].includes(data.type)) {
    await item.ref.update({ status: "ignored", processor: "github-actions", processedAt: FieldValue.serverTimestamp() });
    continue;
  }

  if (!smsReady) {
    waiting++;
    await item.ref.update({ status: "waiting_provider", lastError: "SMS provider credentials are not configured.", updatedAt: FieldValue.serverTimestamp() });
    continue;
  }

  const to = String(data.phone || "").trim();
  const body = String(data.message || "").trim();

  if (!to || !body) {
    failed++;
    await item.ref.update({ status: "failed", lastError: "Missing phone or message.", updatedAt: FieldValue.serverTimestamp() });
    continue;
  }

  try {
    const response = await sms.messages.create({ body, from, to });
    sent++;
    await item.ref.update({ status: "sent", provider: "twilio", messageSid: response.sid, sentAt: FieldValue.serverTimestamp() });
  } catch (error) {
    failed++;
    await item.ref.update({ status: "failed", provider: "twilio", lastError: error?.message || "SMS sending failed.", updatedAt: FieldValue.serverTimestamp() });
  }
}

console.log(JSON.stringify({
  newBookings,
  pushSent,
  checked: snapshot.size,
  sent,
  failed,
  waiting,
  timestamp: new Date().toISOString()
}));
