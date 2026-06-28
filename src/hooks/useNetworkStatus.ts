import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to detect internet connection and server reachability.
 * 
 * @returns {Object} { isOnline, isServerReachable, checkStatus }
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isServerReachable, setIsServerReachable] = useState<boolean>(true);
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(navigator.onLine ? new Date() : null);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);

  const HEALTH_CHECK_URL = (import.meta.env.VITE_MAIN_SERVER || "") + "/api/health";
  const PING_INTERVAL = 30000; // 30 seconds
  const REQUEST_TIMEOUT = 10000; // 10 seconds (increased for high-latency connections)

  /**
   * Pings the health endpoint to check server reachability.
   */
  const checkServerReachability = useCallback(async () => {
    // If browser is offline, we know server isn't reachable via this client
    if (!navigator.onLine) {
      setIsServerReachable(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(HEALTH_CHECK_URL, {
        method: "GET",
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeoutId);

      // Check if response is successful (adjust based on your API's health response)
      if (response.ok) {
        try {
          const data = await response.json();
          if (data.status === "ok") {
            setIsServerReachable(true);
            setLastSyncAt(new Date());
          } else {
            setIsServerReachable(false);
          }
        } catch (e) {
          // If not JSON or status not ok, but response was ok, we might consider it reachable
          // but let's follow the convention of the existing useServerHealth
          setIsServerReachable(false);
        }
      } else {
        setIsServerReachable(false);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      setIsServerReachable(false);
    }
  }, [HEALTH_CHECK_URL]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnlineAt(new Date());
      checkServerReachability();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsServerReachable(false);
    };

    // Listen to browser online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    checkServerReachability();

    // Periodic ping to detect server unreachable state while online
    const intervalId = setInterval(() => {
      if (navigator.onLine) {
        checkServerReachability();
      }
    }, PING_INTERVAL);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(intervalId);
    };
  }, [checkServerReachability]);

  return {
    isOnline,
    isServerReachable,
    lastOnlineAt,
    lastSyncAt,
    checkStatus: checkServerReachability
  };
};

export default useNetworkStatus;