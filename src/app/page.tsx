"use client";

import { useState } from "react";
import { useTodos } from "@/hooks/useTodos";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useBackgroundSync } from "@/hooks/useBackgroundSync";
import { useTodoReminders } from "@/hooks/useTodoReminders";
import { AddTodoForm } from "@/components/AddTodoForm";
import { FilterBar } from "@/components/FilterBar";
import { TodoList } from "@/components/TodoList";
import { StatsBar } from "@/components/StatsBar";
import { NotificationSettings } from "@/components/NotificationSettings";
import { Sparkles, Bell, BellRing, RefreshCw } from "lucide-react";

export default function Home() {
  const [showPWASettings, setShowPWASettings] = useState(false);

  const {
    todos,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    stats,
    hydrated,
  } = useTodos();

  const { permission, sendLocalNotification } = usePushNotifications();
  const { syncing, registerSync } = useBackgroundSync();

  // Nhắc nhở công việc sắp đến hạn / quá hạn
  useTodoReminders(todos, sendLocalNotification, permission);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">
                TodoFlow
              </h1>
              <p className="text-xs text-slate-400 leading-tight hidden sm:block">
                Quản lý công việc thông minh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Background sync button */}
            <button
              onClick={registerSync}
              disabled={syncing}
              title="Đồng bộ dữ liệu"
              className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition"
            >
              <RefreshCw size={15} className={syncing ? "animate-spin" : ""} />
            </button>

            {/* Notification bell */}
            <button
              onClick={() => setShowPWASettings(true)}
              title="Cài đặt thông báo"
              className="p-2 rounded-xl text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition relative"
            >
              {permission === "granted" ? (
                <BellRing size={15} className="text-violet-500" />
              ) : (
                <Bell size={15} />
              )}
              {permission === "default" && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
              )}
            </button>

            <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "short",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <StatsBar
          total={stats.total}
          active={stats.active}
          completed={stats.completed}
        />
        <AddTodoForm onAdd={addTodo} />
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          completedCount={stats.completed}
          onClearCompleted={clearCompleted}
        />
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />
      </main>

      <footer className="text-center py-8 text-xs text-slate-300 dark:text-slate-700">
        TodoFlow PWA — Offline ready · Push notifications · Background sync
      </footer>

      {/* PWA Settings Modal */}
      {showPWASettings && (
        <NotificationSettings onClose={() => setShowPWASettings(false)} />
      )}
    </div>
  );
}
