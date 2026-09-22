import admin from "firebase-admin";
import twilio from "twilio";

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!serviceAccountJson) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
  });
}

const db = admin.firestore();
const snapshot = await db.collection("automationQueue")
  .where("status", "==", "queued")
  .limit(50)
  .get();

let sent = 0;
let failed = 0;
let waiting = 0;

const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_PHONE_NUMBER;
const smsReady = Boolean(sid && token && from);
const sms = smsReady ? twilio(sid, token) : null;

for (const item of snapshot.docs) {
  const data = item.data();

  if (data.type === "whatsapp_manual") {
    await item.ref.update({
      status: "ready",
      processor: "github-actions",
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    continue;
  }

  if (!["status_change", "event_reminder", "payment_due"].includes(data.type)) {
    await item.ref.update({
      status: "ignored",
      processor: "github-actions",
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    continue;
  }

  if (!smsReady) {
    waiting++;
    await item.ref.update({
      status: "waiting_provider",
      lastError: "SMS provider credentials are not configured.",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    continue;
  }

  const to = String(data.phone || "").trim();
  const body = String(data.message || "").trim();

  if (!to || !body) {
    failed++;
    await item.ref.update({
      status: "failed",
      lastError: "Missing phone or message.",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    continue;
  }

  try {
    const response = await sms.messages.create({ body, from, to });
    sent++;
    await item.ref.update({
      status: "sent",
      provider: "twilio",
      messageSid: response.sid,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    failed++;
    await item.ref.update({
      status: "failed",
      provider: "twilio",
      lastError: error?.message || "SMS sending failed.",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}

console.log(JSON.stringify({
  checked: snapshot.size,
  sent,
  failed,
  waiting,
  timestamp: new Date().toISOString(),
}));
