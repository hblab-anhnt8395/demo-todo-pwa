"use client";

import { useState, useEffect, useCallback } from "react";

const SYNC_TAG = "sync-todos";

export function useBackgroundSync() {
  const [supported, setSupported] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const ok =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "SyncManager" in window;
    setSupported(ok);

    // Lắng nghe message từ Service Worker khi sync hoàn thành
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "SYNC_COMPLETE") {
        setLastSync(new Date(event.data.timestamp));
        setSyncing(false);
      }
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", handler);
    }

    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", handler);
      }
    };
  }, []);

  const registerSync = useCallback(async () => {
    if (!supported) return;
    try {
      setSyncing(true);
      const reg = await navigator.serviceWorker.ready;
      // @ts-expect-error - SyncManager types not in all TS versions
      await reg.sync.register(SYNC_TAG);
    } catch {
      setSyncing(false);
    }
  }, [supported]);

  return { supported, lastSync, syncing, registerSync };
}
