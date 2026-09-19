import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { app, db, vapidKey } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function enablePushNotifications(): Promise<string | null> {
  try {
    const supported = await isSupported();

    if (!supported) {
      console.log("Push Notifications غير مدعومة في هذا المتصفح.");
      return null;
    }

    if (!("Notification" in window)) {
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("تم رفض إذن الإشعارات.");
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const messaging = getMessaging(app);

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.log("لم يتم الحصول على FCM Token.");
      return null;
    }

    await setDoc(
      doc(db, "pushTokens", token),
      {
        token,
        platform: "web",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        active: true,
      },
      { merge: true }
    );

    onMessage(messaging, (payload) => {
      console.log("📩 Push Notification:", payload);

      if (Notification.permission === "granted") {
        new Notification(
          payload.notification?.title || "Ibra Production",
          {
            body:
              payload.notification?.body ||
              "لديك إشعار جديد",
            icon: "/logo.jpg",
          }
        );
      }
    });

    console.log("✅ Push Notifications مفعلة");
    console.log("FCM Token:", token);

    return token;
  } catch (error) {
    console.error("❌ Push Notification Error:", error);
    return null;
  }
}
