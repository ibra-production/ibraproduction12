import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "1mb" }));

// =========================================================
// Ibra Production — server-side automation runner
// Provider credentials stay server-side.
// GitHub Actions is the production scheduler.
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

        // SMS/Bar9 delivery is handled by scripts/automation-runner.mjs
        // in GitHub Actions. Do not send provider messages from this public
        // browser-facing Express server.
        if (["status_change", "event_reminder", "payment_due"].includes(data.type)) {
          await item.ref.update({
            status: "queued",
            processor: "server",
            note: "Waiting for GitHub Actions Bar9 processor.",
            updatedAt: FieldValue.serverTimestamp(),
          });
          continue;
        }

        await item.ref.update({
          status: "ignored",
          processor: "server",
          processedAt: FieldValue.serverTimestamp(),
        });
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

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: "127.0.0.1",
        strictPort: true,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
