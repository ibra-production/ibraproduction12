import admin from "firebase-admin";

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!serviceAccountJson) throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON");

if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(JSON.parse(serviceAccountJson)) });

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

let sent = 0, failed = 0, waiting = 0, pushSent = 0, newBookings = 0;

// =========================================================
// OWNER SMS VIA BAR9
// Bar9 requires an accepted template. Keep all credentials server-side.
// =========================================================
const bar9Key = process.env.BAR9_API_KEY;
const bar9TemplateId = process.env.BAR9_TEMPLATE_ID;
const bar9Language = process.env.BAR9_LANGUAGE || "ar";
const ownerPhone = String(process.env.IBRA_OWNER_PHONE || "").trim();

const bar9Ready = Boolean(bar9Key && bar9TemplateId && ownerPhone);

const normalizeDzPhone = (value) => {
  const raw = String(value || "").replace(/[^0-9+]/g, "");
  if (raw.startsWith("+213")) return raw;
  if (raw.startsWith("213")) return "+" + raw;
  if (raw.startsWith("0")) return "+213" + raw.slice(1);
  return raw;
};

const sendBar9 = async (message) => {
  if (!bar9Ready) return { ready: false };
  const response = await fetch("https://api.bar9.dev/v1/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bar9Key}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      to: normalizeDzPhone(ownerPhone),
      template_id: bar9TemplateId,
      language: bar9Language,
      variables: { message }
    })
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result?.error?.message || `Bar9 HTTP ${response.status}`);
  }
  return { ready: true, data: result?.data || {} };
};

// =========================================================
// NEW BOOKING OWNER NOTIFICATION
// Sends the complete booking summary only to the owner's configured phone.
// =========================================================
const newBookingSnapshot = await db.collection("bookings")
  .where("status", "==", "new")
  .limit(50)
  .get();

for (const bookingDoc of newBookingSnapshot.docs) {
  const booking = bookingDoc.data();
  if (booking.ownerSmsNotifiedAt) continue;

  const dates = Array.isArray(booking.eventDates) && booking.eventDates.length
    ? booking.eventDates.join(" • ")
    : (booking.eventDate || "—");

  const body = [
    "Ibra Production — حجز جديد",
    `رقم الحجز: #${bookingDoc.id}`,
    `العريس: ${booking.groomName || "—"}`,
    `العروس: ${booking.brideName || "—"}`,
    `الهاتف: ${booking.phone || "—"}`,
    `الإيميل: ${booking.email || "—"}`,
    `المناسبة: ${booking.eventType || "—"}`,
    `التواريخ: ${dates}`,
    `الوقت: ${booking.eventTime || "—"}`,
    `الولاية: ${booking.wilaya || "—"}`,
    `المكان: ${booking.venue || "—"}`,
    `الخدمة: ${booking.serviceId || "—"}`,
    `الباقة: ${booking.packageId || "—"}`,
    `الملاحظات: ${booking.notes || "—"}`
  ].join("\n");

  if (!bar9Ready) {
    waiting++;
    await bookingDoc.ref.update({
      ownerSmsStatus: "waiting_provider",
      ownerSmsLastError: "Bar9 credentials/template/owner phone are not configured."
    });
    continue;
  }

  try {
    const result = await sendBar9(body);
    await bookingDoc.ref.update({
      ownerSmsNotifiedAt: FieldValue.serverTimestamp(),
      ownerSmsStatus: result.data?.status || "queued",
      ownerSmsMessageId: result.data?.id || null,
      ownerSmsCostCredits: result.data?.cost_credits ?? null,
      ownerSmsLastError: FieldValue.delete()
    });
    newBookings++;
  } catch (error) {
    failed++;
    await bookingDoc.ref.update({
      ownerSmsStatus: "failed",
      ownerSmsLastError: error?.message || "Bar9 send failed."
    });
  }
}

// =========================================================
// AUTOMATION QUEUE
// =========================================================
const snapshot = await db.collection("automationQueue")
  .where("status", "==", "queued")
  .limit(50)
  .get();

const smsReady = bar9Ready;

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
    await item.ref.update({
      status: "queued",
      lastError: "Bar9 credentials/template/owner phone are not configured.",
      updatedAt: FieldValue.serverTimestamp()
    });
    continue;
  }

  const body = String(data.message || "").trim();

  if (!body) {
    failed++;
    await item.ref.update({ status: "failed", lastError: "Missing phone or message.", updatedAt: FieldValue.serverTimestamp() });
    continue;
  }

  try {
    const result = await sendBar9(body);
    sent++;
    await item.ref.update({
      status: result.data?.status || "queued",
      provider: "bar9",
      messageId: result.data?.id || null,
      costCredits: result.data?.cost_credits ?? null,
      sentAt: FieldValue.serverTimestamp()
    });
  } catch (error) {
    failed++;
    await item.ref.update({ status: "failed", provider: "bar9", lastError: error?.message || "SMS sending failed.", updatedAt: FieldValue.serverTimestamp() });
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
