import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import twilio from "twilio";

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
