(async () => {
  try {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();

      for (const registration of registrations) {
        await registration.unregister();
      }
    }

    if ("caches" in window) {
      const keys = await caches.keys();

      for (const key of keys) {
        await caches.delete(key);
      }
    }

    console.log("Ibra Production: old cache/service workers cleared");
  } catch (e) {
    console.error("Cache cleanup error:", e);
  }
})();
