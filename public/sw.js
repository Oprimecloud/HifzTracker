// public/sw.js
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 🚀 CRITICAL: The Bypass Logic for iOS PWA Audio
self.addEventListener('fetch', (event) => {
  // 🚀 Bypass service worker for audio and API streams to prevent PWA silence
  const url = event.request.url;
  if (
    url.includes('islamic.network') || 
    url.includes('aladhan.com') || 
    url.includes('alquran.cloud') || 
    url.includes('hisnmuslim.com')
  ) {
    return; 
  }
});

// Listen for the Adhan trigger from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PLAY_ADHAN') {
    self.registration.showNotification('Time for Prayer', {
      body: `It is time for ${event.data.prayerName} in ${event.data.location}.`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'adhan-notification',
      renotify: true,
    });
  }
});