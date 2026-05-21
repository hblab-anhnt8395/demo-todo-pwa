"use client";

import { useTodos } from "@/hooks/useTodos";
import { AddTodoForm } from "@/components/AddTodoForm";
import { FilterBar } from "@/components/FilterBar";
import { TodoList } from "@/components/TodoList";
import { StatsBar } from "@/components/StatsBar";
import { Sparkles } from "lucide-react";

export default function Home() {
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
            <span className="text-xs text-slate-400 dark:text-slate-500">
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
        {/* Stats */}
        <StatsBar
          total={stats.total}
          active={stats.active}
          completed={stats.completed}
        />

        {/* Add form */}
        <AddTodoForm onAdd={addTodo} />

        {/* Filter bar */}
        <FilterBar
          filter={filter}
          setFilter={setFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          completedCount={stats.completed}
          onClearCompleted={clearCompleted}
        />

        {/* Todo list */}
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-slate-300 dark:text-slate-700">
        TodoFlow — Dữ liệu lưu tự động trên trình duyệt
      </footer>
    </div>
  );
}
