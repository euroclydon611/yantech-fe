import React from "react";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { WifiOff, ServerCrash, RefreshCw } from "lucide-react";

/**
 * NetworkBanner component that displays status when the user is offline
 * or the server is unreachable.
 */
const NetworkBanner: React.FC = () => {
  const { isOnline, isServerReachable, checkStatus, lastSyncAt } = useNetworkStatus();

  // If everything is fine, don't show the banner
  if (isOnline && isServerReachable) {
    return null;
  }

  const formatTime = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] animate-in slide-in-from-top duration-300">
      {!isOnline ? (
        <div className="bg-destructive text-destructive-foreground px-4 py-2 flex items-center justify-center gap-2 shadow-md">
          <WifiOff size={18} />
          <span className="text-sm font-medium">
            Connection lost. Please check your internet
          </span>
        </div>
      ) : !isServerReachable ? (
        <div className="bg-warning text-warning-foreground px-4 py-2 flex items-center justify-center gap-2 shadow-md">
          <ServerCrash size={18} />
          <span className="text-sm font-medium">
            Connected, but server is unreachable {lastSyncAt && `(Last synced: ${formatTime(lastSyncAt)})`}
          </span>
          <button
            onClick={() => checkStatus()}
            className="ml-2 p-1 hover:bg-black/10 rounded-full transition-colors group"
            title="Retry connection"
          >
            <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default NetworkBanner;
