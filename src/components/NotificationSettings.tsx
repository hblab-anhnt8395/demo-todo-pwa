"use client";

import { useState } from "react";
import { Bell, BellOff, BellRing, RefreshCw, X } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useBackgroundSync } from "@/hooks/useBackgroundSync";
import clsx from "clsx";

interface Props {
  onClose: () => void;
}

export function NotificationSettings({ onClose }: Props) {
  const { permission, supported: notifSupported, requestPermission, sendLocalNotification } =
    usePushNotifications();
  const { supported: syncSupported, lastSync, syncing, registerSync } =
    useBackgroundSync();
  const [requesting, setRequesting] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const handleRequestPermission = async () => {
    setRequesting(true);
    await requestPermission();
    setRequesting(false);
  };

  const handleTestNotification = async () => {
    await sendLocalNotification("TodoFlow 🎉", {
      body: "Thông báo hoạt động tốt! Bạn sẽ nhận được nhắc nhở công việc.",
    });
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Cài đặt PWA
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Push Notifications */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <Bell size={14} className="text-violet-600" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Thông báo đẩy
              </span>
            </div>

            {!notifSupported ? (
              <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg px-3 py-2">
                Trình duyệt không hỗ trợ push notification
              </p>
            ) : permission === "granted" ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg px-3 py-2">
                  <BellRing size={13} />
                  Đã bật — Bạn sẽ nhận được nhắc nhở công việc
                </div>
                <button
                  onClick={handleTestNotification}
                  className={clsx(
                    "w-full py-2 rounded-lg text-xs font-medium border transition",
                    testSent
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-violet-400 hover:text-violet-600"
                  )}
                >
                  {testSent ? "✓ Đã gửi thông báo thử!" : "Gửi thông báo thử"}
                </button>
              </div>
            ) : permission === "denied" ? (
              <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 dark:bg-rose-900/20 rounded-lg px-3 py-2">
                <BellOff size={13} />
                Đã chặn — Vui lòng bật lại trong cài đặt trình duyệt
              </div>
            ) : (
              <button
                onClick={handleRequestPermission}
                disabled={requesting}
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-xs font-medium transition flex items-center justify-center gap-2"
              >
                <Bell size={13} />
                {requesting ? "Đang yêu cầu..." : "Bật thông báo đẩy"}
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 dark:border-slate-700" />

          {/* Background Sync */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <RefreshCw size={14} className="text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Background Sync
              </span>
            </div>

            {!syncSupported ? (
              <p className="text-xs text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-lg px-3 py-2">
                Trình duyệt không hỗ trợ Background Sync
              </p>
            ) : (
              <div className="space-y-2">
                {lastSync && (
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Đồng bộ lần cuối: {formatTime(lastSync)}
                  </p>
                )}
                <button
                  onClick={registerSync}
                  disabled={syncing}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-medium transition flex items-center justify-center gap-2"
                >
                  <RefreshCw size={13} className={clsx(syncing && "animate-spin")} />
                  {syncing ? "Đang đồng bộ..." : "Đồng bộ ngay"}
                </button>
              </div>
            )}
          </div>

          {/* PWA Status */}
          <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Trạng thái PWA
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Service Worker", check: "serviceWorker" in navigator },
                { label: "Offline Cache", check: "caches" in window },
                { label: "Push API", check: "PushManager" in window },
                { label: "Background Sync", check: "SyncManager" in window },
              ].map(({ label, check }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
                >
                  <span className={clsx("w-1.5 h-1.5 rounded-full", check ? "bg-emerald-500" : "bg-slate-300")} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
