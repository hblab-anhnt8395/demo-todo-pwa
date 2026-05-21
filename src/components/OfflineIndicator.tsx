"use client";

import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
      {!isOnline ? (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-xs font-medium shadow-lg">
          <WifiOff size={13} />
          Đang offline — dữ liệu lưu cục bộ
        </div>
      ) : showReconnected ? (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-medium shadow-lg">
          <Wifi size={13} />
          Đã kết nối lại
        </div>
      ) : null}
    </div>
  );
}
