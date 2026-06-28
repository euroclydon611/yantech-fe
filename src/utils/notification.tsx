import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const isSecureContext = window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const isMessagingSupported = 'serviceWorker' in navigator && 'Notification' in window && 'PushManager' in window;

const app = initializeApp(firebaseConfig);
const messaging = isSecureContext && isMessagingSupported ? getMessaging(app) : null;

// AudioContext unlock for browser autoplay policy
// Most browsers require user interaction before audio can play
let audioContextUnlocked = false;

export const unlockAudioContext = () => {
  if (audioContextUnlocked) return;
  
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') {
        // Create a dummy audio element and play it to unlock autoplay
        const dummy = new Audio();
        dummy.src = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==';
        dummy.volume = 0;
        dummy.play().then(() => {
          if (ctx.resume) {
            ctx.resume().then(() => {
              console.log('[notification.tsx] AudioContext unlocked');
              audioContextUnlocked = true;
            });
          }
        }).catch(err => {
          // console.log('[notification.tsx] Could not unlock AudioContext:', err);
        });
      } else {
        audioContextUnlocked = true;
      }
    }
  } catch (error) {
    console.log('[notification.tsx] AudioContext setup error:', error);
  }
};

export const requestPermission = async () => {
  if (!messaging) {
    console.warn("Firebase Messaging not supported (requires HTTPS or localhost)");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    console.log("permission", permission)

    if (permission == "granted") {
      const vapidKey = import.meta.env.VITE_FIREBASE_VPID_KEY;
      if (!vapidKey) {
        console.error("VAPID Key is missing from environment variables");
        return null;
      }
      
      let registration;
      if ('serviceWorker' in navigator) {
        registration = await navigator.serviceWorker.getRegistration('/');
        if (!registration || !registration.active || registration.active.scriptURL.indexOf('firebase-messaging-sw.js') === -1) {
          console.log("[notification.tsx] Registering/Updating service worker...");
          registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        }
        await navigator.serviceWorker.ready;
      }

      const token = await getToken(messaging, {
        vapidKey: vapidKey,
        serviceWorkerRegistration: registration,
      });

      console.log("Token FCM successfully obtained:",token);
      return token;
    } else {
      return null;
    }
  } catch (error) {
    console.error("ERROR:", error);
    return null;
  }
};

export const onMessageListener = () => {
  return new Promise((resolve) => {
    if (!messaging) {
      console.warn("Firebase Messaging not supported (requires HTTPS or localhost)");
      return;
    }
    
    onMessage(messaging, (payload) => {
      console.log("Message reçu en temps réel:", payload);
      playNotificationSound().catch(err => {
        console.warn("[notification.tsx] Foreground sound playback failed:", err);
      });
      resolve(payload);
    });
  });
};

/**
 * Play notification sound
 * Tries multiple sound files for compatibility
 */
export const playNotificationSound = async () => {
  try {
    const soundUrls = [
      '/new-notification-017-352293.mp3',
      '/new-notification-022-370046.mp3'
    ];

    console.log("[notification.tsx] Attempting to play notification sound...");

    // Try to play the first available sound
    for (const soundUrl of soundUrls) {
      try {
        console.log(`[notification.tsx] Trying to load and play: ${soundUrl}`);
        const audio = new Audio(soundUrl);
        audio.crossOrigin = "anonymous";
        audio.volume = 1.0; // Full volume
        
        // Create a promise that resolves when audio starts playing
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          console.log("[notification.tsx] ✅ Successfully playing notification sound:", soundUrl);
          return; // Successfully played
        }
      } catch (error) {
        console.warn(`[notification.tsx] ❌ Could not play ${soundUrl}:`, error);
        continue; // Try next sound
      }
    }
    
    console.warn("[notification.tsx] ⚠️ Could not play any notification sound (all files failed)");
  } catch (error) {
    console.error("[notification.tsx] Error in playNotificationSound:", error);
  }
};

/**
 * Listen for messages from service worker
 * Handles background notification sound requests
 */
export const setupServiceWorkerMessageListener = () => {
  if ('serviceWorker' in navigator) {
    // console.log('[notification.tsx] Setting up service worker message listener...');
    
    const messageHandler = (event: MessageEvent) => {
      // console.log('[notification.tsx] Received message from service worker:', event.data);
      
      if (event.data?.type === 'PLAY_NOTIFICATION_SOUND') {
        console.log('[notification.tsx] Playing sound based on service worker message');
        playNotificationSound();
      }
    };
    
    // Listen on navigator.serviceWorker for any messages
    navigator.serviceWorker.addEventListener('message', messageHandler);
    
    // Also ensure active controller is listening
    if (navigator.serviceWorker.controller) {
      // console.log('[notification.tsx] Service worker controller found, listener attached');
    } else {
      // console.log('[notification.tsx] No active service worker controller yet, will catch messages via navigator listener');
    }
  } else {
    console.log('[notification.tsx] Service Worker not supported');
  }
};

export { messaging };
