var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_twilio = __toESM(require("twilio"), 1);
var import_app = require("firebase-admin/app");
var import_firestore = require("firebase-admin/firestore");
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
app.post("/api/send-sms", async (req, res) => {
  try {
    const { to, message, bookingId } = req.body;
    if (!to || !message) {
      return res.status(400).json({ success: false, error: "Missing phone number or message content." });
    }
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    if (accountSid && authToken && fromNumber && !accountSid.includes("YOUR_")) {
      const client = (0, import_twilio.default)(accountSid, authToken);
      const response = await client.messages.create({
        body: message,
        from: fromNumber,
        to
      });
      console.log(`[Twilio SMS Sent] Message SID: ${response.sid} to ${to}`);
      return res.json({
        success: true,
        provider: "twilio",
        messageSid: response.sid,
        info: `SMS successfully sent via Twilio to ${to}`
      });
    } else {
      console.log(`[SMS API Simulation] Booking #${bookingId || "N/A"} - To: ${to} - Message: ${message}`);
      return res.json({
        success: true,
        provider: "simulation",
        info: `Simulated SMS sent successfully to ${to}. To enable real Twilio SMS gateway, configure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in environment settings.`
      });
    }
  } catch (error) {
    console.error("SMS API Error:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to send SMS." });
  }
});
app.post("/api/automation/run", async (req, res) => {
  const expected = process.env.AUTOMATION_CRON_SECRET;
  if (!expected || req.headers.authorization !== `Bearer ${expected}`) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  try {
    if (!(0, import_app.getApps)().length) {
      const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
      if (!serviceAccountJson) {
        return res.status(500).json({ success: false, error: "Firebase service account is not configured." });
      }
      (0, import_app.initializeApp)({ credential: (0, import_app.cert)(JSON.parse(serviceAccountJson)) });
    }
    const db = (0, import_firestore.getFirestore)();
    const snapshot = await db.collection("automationQueue").where("status", "==", "queued").limit(50).get();
    let processed = 0;
    let failed = 0;
    for (const item of snapshot.docs) {
      const data = item.data();
      try {
        if (data.type === "whatsapp_manual") {
          await item.ref.update({
            status: "ready",
            processedAt: import_firestore.FieldValue.serverTimestamp(),
            processor: "server"
          });
          processed++;
          continue;
        }
        if (data.type === "status_change" || data.type === "event_reminder" || data.type === "payment_due") {
          const accountSid = process.env.TWILIO_ACCOUNT_SID;
          const authToken = process.env.TWILIO_AUTH_TOKEN;
          const fromNumber = process.env.TWILIO_PHONE_NUMBER;
          if (!accountSid || !authToken || !fromNumber) {
            await item.ref.update({
              status: "waiting_provider",
              lastError: "Twilio is not configured.",
              updatedAt: import_firestore.FieldValue.serverTimestamp()
            });
            continue;
          }
          const to = String(data.phone || "").trim();
          const body = String(data.message || "").trim();
          if (!to || !body) {
            await item.ref.update({
              status: "failed",
              lastError: "Missing phone or message.",
              updatedAt: import_firestore.FieldValue.serverTimestamp()
            });
            failed++;
            continue;
          }
          const client = (0, import_twilio.default)(accountSid, authToken);
          const response = await client.messages.create({ body, from: fromNumber, to });
          await item.ref.update({
            status: "sent",
            provider: "twilio",
            messageSid: response.sid,
            sentAt: import_firestore.FieldValue.serverTimestamp()
          });
          processed++;
        }
      } catch (error) {
        failed++;
        await item.ref.update({
          status: "failed",
          lastError: error?.message || "Automation processing failed.",
          updatedAt: import_firestore.FieldValue.serverTimestamp()
        });
      }
    }
    return res.json({
      success: true,
      processed,
      failed,
      checked: snapshot.size,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Automation runner error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Automation runner failed."
    });
  }
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
