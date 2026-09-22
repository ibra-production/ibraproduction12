import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import twilio from "twilio";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const app = express();
const PORT = 3000;

app.use(express.json());

// API route to send SMS notification to client
app.post("/api/send-sms", async (req, res) => {
  try {
    const { to, message, bookingId } = req.body;

    if (!to || !message) {
      return res.status(400).json({ success: false, error: "Missing phone number or message content." });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    // Check if Twilio is configured with valid credentials
    if (accountSid && authToken && fromNumber && !accountSid.includes("YOUR_")) {
      const client = twilio(accountSid, authToken);
      const response = await client.messages.create({
        body: message,
        from: fromNumber,
        to: to
      });

      console.log(`[Twilio SMS Sent] Message SID: ${response.sid} to ${to}`);
      return res.json({ 
        success: true, 
        provider: 'twilio', 
        messageSid: response.sid,
        info: `SMS successfully sent via Twilio to ${to}` 
      });
    } else {
      // Simulation / Local fallback mode when Twilio keys aren't set yet
      console.log(`[SMS API Simulation] Booking #${bookingId || 'N/A'} - To: ${to} - Message: ${message}`);
      return res.json({ 
        success: true, 
        provider: 'simulation',
        info: `Simulated SMS sent successfully to ${to}. To enable real Twilio SMS gateway, configure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in environment settings.` 
      });
    }
  } catch (error: any) {
    console.error("SMS API Error:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to send SMS." });
  }
});


// =========================================================
// Ibra Production — server-side automation runner
// Call POST /api/automation/run from a trusted scheduler.
// Never expose provider secrets to the browser.
// =========================================================
app.post("/api/automation/run", async (req, res) => {
  const expected = process.env.AUTOMATION_CRON_SECRET;
  if (!expected || req.headers.authorization !== `Bearer ${expected}`) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    if (!getApps().length) {
      const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
      if (!serviceAccountJson) {
        return res.status(500).json({ success: false, error: "Firebase service account is not configured." });
      }
      initializeApp({ credential: cert(JSON.parse(serviceAccountJson)) });
    }

    const db = getFirestore();
    const snapshot = await db.collection("automationQueue")
      .where("status", "==", "queued")
      .limit(50)
      .get();

    let processed = 0;
    let failed = 0;

    for (const item of snapshot.docs) {
      const data = item.data();

      try {
        if (data.type === "whatsapp_manual") {
          await item.ref.update({
            status: "ready",
            processedAt: FieldValue.serverTimestamp(),
            processor: "server",
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
              updatedAt: FieldValue.serverTimestamp(),
            });
            continue;
          }

          const to = String(data.phone || "").trim();
          const body = String(data.message || "").trim();

          if (!to || !body) {
            await item.ref.update({
              status: "failed",
              lastError: "Missing phone or message.",
              updatedAt: FieldValue.serverTimestamp(),
            });
            failed++;
            continue;
          }

          const client = twilio(accountSid, authToken);
          const response = await client.messages.create({ body, from: fromNumber, to });

          await item.ref.update({
            status: "sent",
            provider: "twilio",
            messageSid: response.sid,
            sentAt: FieldValue.serverTimestamp(),
          });
          processed++;
        }
      } catch (error: any) {
        failed++;
        await item.ref.update({
          status: "failed",
          lastError: error?.message || "Automation processing failed.",
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    }

    return res.json({
      success: true,
      processed,
      failed,
      checked: snapshot.size,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Automation runner error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Automation runner failed.",
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

async function startServer() {
  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
