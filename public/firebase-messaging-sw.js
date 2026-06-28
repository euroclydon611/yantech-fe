// public/firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyC3XYAsuNPV_9temHxzyNnDuv5RQG5wWhc",
  authDomain: "epa--revgen.firebaseapp.com",
  projectId: "epa--revgen",
  storageBucket: "epa--revgen.firebasestorage.app",
  messagingSenderId: "620240920804",
  appId: "1:620240920804:web:9fc4508031c9034d414cf1",
  measurementId: "G-G3ZNEK88BB"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Helper function to play sound notification by finding a client window
async function playNotificationSound() {
  try {
    const soundUrl = '/new-notification-017-352293.mp3';
    
    console.log("[firebase-messaging-sw.js] Attempting to play notification sound...");
    
    // Broadcast message to all connected clients to play the sound
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    
    console.log(`[firebase-messaging-sw.js] Found ${clients.length} client(s)`);
    
    if (clients && clients.length > 0) {
      // Send message to the first available client to play the sound
      const message = {
        type: 'PLAY_NOTIFICATION_SOUND',
        soundUrl: soundUrl,
        timestamp: new Date().toISOString()
      };
      
      clients[0].postMessage(message);
      console.log("[firebase-messaging-sw.js] ✅ Sent sound playback message to client:", message);
    } else {
      console.log("[firebase-messaging-sw.js] ⚠️ No clients available to play sound");
    }
  } catch (error) {
    console.error('[firebase-messaging-sw.js] ❌ Error triggering sound:', error);
    // Silently fail - sound is not critical for notification delivery
  }
}

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message",
    payload
  );

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    data: payload.data || {},
    tag: payload.data?.notificationId || 'default',
    requireInteraction: true, // Keep notification visible until user interacts
    vibrate: [200, 100, 200], // Vibration pattern for mobile
    // Note: 'sound' property not widely supported in service workers, 
    // we play it programmatically instead
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/view-icon.png' // Optional: add a view icon
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/dismiss-icon.png' // Optional: add a dismiss icon
      }
    ]
  };

  console.log("[firebase-messaging-sw.js] Showing notification:", notificationOptions);
  self.registration.showNotification(notificationTitle, notificationOptions);
  
  // Play notification sound
  playNotificationSound();
});

// Enhanced notification click handler
self.addEventListener("notificationclick", function (event) {
  console.log("[firebase-messaging-sw.js] Notification click received:", event);
  
  event.notification.close();
  
  // Handle different actions
  if (event.action === 'dismiss') {
    // Just close the notification
    return;
  }
  
  // Determine URL to open based on notification data
  let urlToOpen = '/';
  
  if (event.notification.data) {
    const data = event.notification.data;
    
    // Build URL based on notification type and resource
    if (data.resource_type && data.resource_id) {
      switch (data.resource_type) {
        case 'application_submitted':
        case 'application_resubmitted':
          urlToOpen = `/applications/${data.resource_id}`;
          break;
        case 'application_assigned':
          urlToOpen = `/assignments/${data.resource_id}`;
          break;
        case 'leave':
          urlToOpen = `/leave-requests/${data.resource_id}`;
          break;
        case 'overtime':
          urlToOpen = `/overtime-requests/${data.resource_id}`;
          break;
        default:
          urlToOpen = '/notifications';
      }
    } else if (data.click_action) {
      urlToOpen = data.click_action;
    }
  }
  
  console.log("[firebase-messaging-sw.js] Opening URL:", urlToOpen);
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function (clientList) {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no matching window/tab is open, check for any open window
      for (const client of clientList) {
        if ('focus' in client) {
          // Focus existing window and navigate
          client.focus();
          return client.navigate ? client.navigate(urlToOpen) : clients.openWindow(urlToOpen);
        }
      }
      
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Handle notification close event
self.addEventListener('notificationclose', function(event) {
  console.log('[firebase-messaging-sw.js] Notification closed:', event);
  
  // Optional: Send analytics or tracking data
  // You can track which notifications were dismissed without interaction
});


