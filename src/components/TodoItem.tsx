"use client";

import { useState } from "react";
import { Trash2, Pencil, Check, X, Calendar, Flag } from "lucide-react";
import { Todo } from "@/types/todo";
import clsx from "clsx";

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

const PRIORITY_COLORS = {
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  high: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

const PRIORITY_LABELS = {
  low: "Thấp",
  medium: "Vừa",
  high: "Cao",
};

const PRIORITY_DOT = {
  low: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-rose-500",
};

const CATEGORY_EMOJI: Record<string, string> = {
  personal: "👤",
  work: "💼",
  shopping: "🛒",
  health: "❤️",
  other: "📌",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function isOverdue(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText);
    }
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditText(todo.text);
      setEditing(false);
    }
  };

  const overdue = todo.dueDate && !todo.completed && isOverdue(todo.dueDate);

  return (
    <div
      className={clsx(
        "group flex items-start gap-3 p-4 rounded-xl border transition-all duration-200",
        todo.completed
          ? "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50 opacity-60"
          : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-violet-200 dark:hover:border-violet-500/30"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        className={clsx(
          "mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200",
          todo.completed
            ? "bg-violet-600 border-violet-600"
            : "border-slate-300 dark:border-slate-500 hover:border-violet-500"
        )}
      >
        {todo.completed && <Check size={11} className="text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex gap-2">
            <input
              autoFocus
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-violet-400 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
            <button
              onClick={handleSave}
              className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 hover:bg-violet-200 transition"
            >
              <Check size={14} />
            </button>
            <button
              onClick={() => { setEditText(todo.text); setEditing(false); }}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 transition"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <p
              className={clsx(
                "text-sm leading-relaxed break-words",
                todo.completed
                  ? "line-through text-slate-400 dark:text-slate-500"
                  : "text-slate-700 dark:text-slate-200"
              )}
            >
              {todo.text}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              {/* Priority badge */}
              <span className={clsx("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium", PRIORITY_COLORS[todo.priority])}>
                <Flag size={10} />
                {PRIORITY_LABELS[todo.priority]}
              </span>

              {/* Category */}
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {CATEGORY_EMOJI[todo.category]}
              </span>

              {/* Due date */}
              {todo.dueDate && (
                <span className={clsx(
                  "inline-flex items-center gap-1 text-xs",
                  overdue ? "text-rose-500 font-medium" : "text-slate-400 dark:text-slate-500"
                )}>
                  <Calendar size={10} />
                  {formatDate(todo.dueDate)}
                  {overdue && " (Quá hạn)"}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      {!editing && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition"
            title="Sửa"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition"
            title="Xóa"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
