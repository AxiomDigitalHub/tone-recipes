/**
 * /sw.js — self-unregistering service worker.
 *
 * Background: an earlier version of the site registered a service worker.
 * It was removed, but returning visitors' browsers still have the old SW
 * installed and poll `/sw.js` every ~60s for updates. The production logs
 * show a steady drumbeat of 404s from this — harmless, but noisy and a
 * small waste of bandwidth.
 *
 * This route serves a minimal SW that, when installed, immediately
 * unregisters itself and reloads any page it controlled. After one fetch,
 * the stale SW is gone and the 404 flood stops. New visitors never
 * register this SW (nothing in the app calls `navigator.serviceWorker.
 * register('/sw.js')` anymore), so this route simply cleans up residue.
 *
 * Safe to delete this route in ~3 months (by which time all residual
 * installations will have rotated themselves out).
 */

const BODY = `// Self-unregistering service worker.
// The site no longer uses a service worker. If your browser still has
// one installed, this script tears it down cleanly.
self.addEventListener('install', (event) => {
  // Take over immediately; don't wait for the next navigation.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      // Drop any caches the old SW might have populated.
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (e) {
      // Ignore — cache API may be unavailable in some contexts.
    }

    try {
      await self.registration.unregister();
    } catch (e) {
      // Ignore — already unregistered or not permitted.
    }

    // Force-reload any tabs this worker was controlling so they
    // start serving fresh content.
    try {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client) => {
        if (client.url && 'navigate' in client) {
          client.navigate(client.url);
        }
      });
    } catch (e) {
      // Ignore — clients API may be unavailable.
    }
  })());
});
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      // Service workers are cache-sensitive: setting no-cache + max-age=0
      // means the browser will revalidate on every check, and when the
      // SW is finally gone this file is served fresh (avoids a scenario
      // where a cached version gets stuck and never unregisters).
      "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
      // Explicitly scope the SW to the entire site — defensive; browsers
      // infer this from the fetch path anyway.
      "Service-Worker-Allowed": "/",
    },
  });
}
