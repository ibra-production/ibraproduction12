importScripts("https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyATSuJTP2UVZoYcfaGILaY1e0D7qbEtdMc",
  authDomain: "ibra-production-web.firebaseapp.com",
  projectId: "ibra-production-web",
  storageBucket: "ibra-production-web.firebasestorage.app",
  messagingSenderId: "794299708186",
  appId: "1:794299708186:web:e11b19267055588a0532a3",
  measurementId: "G-C5G56NW0CM"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title =
    payload.notification?.title ||
    "Ibra Production";

  const options = {
    body:
      payload.notification?.body ||
      "لديك إشعار جديد",
    icon: "/logo.jpg",
    badge: "/logo.jpg",
    data: payload.data || {}
  };

  self.registration.showNotification(
    title,
    options
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
