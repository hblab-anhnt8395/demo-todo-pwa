"use client";

import { useState, useEffect, useCallback } from "react";

type PermissionState = "default" | "granted" | "denied";

// vibrate là Web API chuẩn nhưng TypeScript lib chưa include
interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];
  badge?: string;
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<PermissionState>("default");
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const ok =
      typeof window !== "undefined" &&
      "Notification" in window &&
      "serviceWorker" in navigator;
    setSupported(ok);
    if (ok) setPermission(Notification.permission as PermissionState);
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!supported) return false;
    try {
      const result = await Notification.requestPermission();
      setPermission(result as PermissionState);
      return result === "granted";
    } catch {
      return false;
    }
  }, [supported]);

  const sendLocalNotification = useCallback(
    async (title: string, options?: ExtendedNotificationOptions) => {
      if (permission !== "granted") return;
      const notifOptions: ExtendedNotificationOptions = {
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        vibrate: [200, 100, 200],
        ...options,
      };
      try {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification(title, notifOptions as NotificationOptions);
      } catch {
        // Fallback sang Notification API thông thường
        new Notification(title, { icon: notifOptions.icon, ...options });
      }
    },
    [permission]
  );

  return { permission, supported, requestPermission, sendLocalNotification };
}
