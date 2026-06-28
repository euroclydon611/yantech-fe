import { useState, useEffect, useCallback } from "react";

interface ServerHealthState {
  isHealthy: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  error: string | null;
}

const HEALTH_CHECK_URL = (import.meta.env.VITE_MAIN_SERVER || "") + "/api/health";
const CHECK_INTERVAL = 30000;
const REQUEST_TIMEOUT = 8000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useServerHealth = (autoCheck: boolean = true) => {
  const [state, setState] = useState<ServerHealthState>({
    isHealthy: true,
    isChecking: true,
    lastChecked: null,
    error: null,
  });

  const attemptFetch = useCallback(async (): Promise<boolean> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(HEALTH_CHECK_URL, {
        method: "GET",
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return data.status === "ok";
      }

      return false;
    } catch {
      clearTimeout(timeoutId);
      return false;
    }
  }, []);

  const checkServerHealth = useCallback(async (showLoading: boolean = false) => {
    if (showLoading) {
      setState((prev) => ({ ...prev, isChecking: true, error: null }));
    }

    let success = false;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      success = await attemptFetch();
      if (success) break;
      if (attempt < MAX_RETRIES - 1) await sleep(RETRY_DELAY);
    }

    if (success) {
      setState({
        isHealthy: true,
        isChecking: false,
        lastChecked: new Date(),
        error: null,
      });
    } else {
      setState({
        isHealthy: false,
        isChecking: false,
        lastChecked: new Date(),
        error: "Unable to connect to server",
      });
    }

    return success;
  }, [attemptFetch]);

  useEffect(() => {
    if (!autoCheck) return;

    checkServerHealth(true);

    const intervalId = setInterval(() => checkServerHealth(false), CHECK_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [autoCheck, checkServerHealth]);

  return {
    ...state,
    checkHealth: checkServerHealth,
  };
};

export default useServerHealth;