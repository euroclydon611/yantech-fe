import {
  requestPermission,
  onMessageListener,
  setupServiceWorkerMessageListener,
  unlockAudioContext,
} from "@/utils/notification";
import { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRegisterFCMTokenMutation } from "@/redux/features/employee-portal-api/general";
import { RootState } from "@/redux/store";

// Notification Type
interface NotificationData {
  id: number;
  title: string;
  body: string;
  data?: Record<string, any>;
  timestamp: Date;
  read?: boolean;
}

const useNotifications = () => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [tokenRegistered, setTokenRegistered] = useState(false);

  // Get user from auth state
  const { employee } = useSelector((state: RootState) => state.employee_auth);

  // Redux mutation for registering FCM token
  const [registerFCMToken, { isLoading: isRegistering, error: registerError }] =
    useRegisterFCMTokenMutation();

  useEffect(() => {
    const initializeNotifications = async () => {
      // Only request permission and get token if notifications are supported
      if (!("Notification" in window)) {
        console.log("Notifications not supported by this browser");
        return;
      }

      try {
        // Unlock AudioContext for browser autoplay policy
        unlockAudioContext();

        // Setup service worker message listener for background notifications
        setupServiceWorkerMessageListener();

        // Check if permission is already granted, then get token
        if (Notification.permission === "granted") {
          const token = await requestPermission();
          if (token) {
            setFcmToken(token);
          }
        }
      } catch (error) {
        console.error("Error initializing notifications:", error);
      }
    };

    initializeNotifications();
  }, []);

  const handleRequestPermission = async () => {
    try {
      const token = await requestPermission();
      if (token) {
        setFcmToken(token);
        return token;
      }
      return null;
    } catch (error) {
      console.error("Error in handleRequestPermission:", error);
      return null;
    }
  };

  // Register FCM token with backend when user is authenticated and token is available
  useEffect(() => {
    const registerToken = async () => {
      if (fcmToken && employee?._id && !tokenRegistered) {
        try {
          // console.log('Registering FCM token with backend...', { fcmToken });
          await registerFCMToken({ fcmToken }).unwrap();
          // console.log('FCM token registered successfully');
          setTokenRegistered(true);
          toast.success("Notifications enabled", { autoClose: 3000 });
        } catch (error: any) {
          console.error("Error registering FCM token:", error);
          toast.error("Failed to enable notifications", { autoClose: 3000 });
        }
      }else {
        console.log("fcmTokensfcmTokens")
      }
    };


    registerToken();
  }, [fcmToken, employee?.id, tokenRegistered, registerFCMToken]);

  useEffect(() => {
    const handleForegroundMessage = async () => {
      try {
        const payload = (await onMessageListener()) as any;
        const { notification, data } = payload;

        const newNotification: NotificationData = {
          id: Date.now(),
          title: notification?.title || "No Title",
          body: notification?.body || "",
          data,
          timestamp: new Date(),
          read: false,
        };

        setNotifications((prev) => [...prev, newNotification]);

        toast.info(notification?.body || "New Notification", {
          position: "top-right",
          autoClose: 5000,
        });
      } catch (error) {
        console.error("Error handling FCM message:", error);
      }
    };

    if (fcmToken) {
      handleForegroundMessage();
    }
  }, [fcmToken]);

  const markAsRead = (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    fcmToken,
    notifications,
    markAsRead,
    clearAll,
    handleRequestPermission,
    unreadCount: notifications.filter((n) => !n.read).length,
  };
};

export default useNotifications;
