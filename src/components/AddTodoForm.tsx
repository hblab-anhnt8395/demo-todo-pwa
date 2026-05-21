"use client";

import { useState } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Priority, Category } from "@/types/todo";
import clsx from "clsx";

interface Props {
  onAdd: (text: string, priority: Priority, category: Category, dueDate?: Date) => void;
}

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  { value: "low", label: "Thấp", color: "text-emerald-500" },
  { value: "medium", label: "Vừa", color: "text-amber-500" },
  { value: "high", label: "Cao", color: "text-rose-500" },
];

const CATEGORY_OPTIONS: { value: Category; label: string; emoji: string }[] = [
  { value: "personal", label: "Cá nhân", emoji: "👤" },
  { value: "work", label: "Công việc", emoji: "💼" },
  { value: "shopping", label: "Mua sắm", emoji: "🛒" },
  { value: "health", label: "Sức khỏe", emoji: "❤️" },
  { value: "other", label: "Khác", emoji: "📌" },
];

export function AddTodoForm({ onAdd }: Props) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("personal");
  const [dueDate, setDueDate] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, priority, category, dueDate ? new Date(dueDate) : undefined);
    setText("");
    setPriority("medium");
    setCategory("personal");
    setDueDate("");
    setShowOptions(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6"
    >
      <div className="flex gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Thêm công việc mới..."
          className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={() => setShowOptions((v) => !v)}
          className="flex items-center gap-1 px-3 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition text-sm"
        >
          {showOptions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        <button
          type="submit"
          disabled={!text.trim()}
          className="flex items-center justify-center gap-2 px-3 sm:px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition shadow-sm shadow-violet-200 dark:shadow-none flex-shrink-0"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Thêm</span>
        </button>
      </div>

      {showOptions && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider">
              Ưu tiên
            </label>
            <div className="flex gap-2">
              {PRIORITY_OPTIONS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={clsx(
                    "flex-1 py-2 rounded-lg text-xs font-medium border transition",
                    priority === p.value
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-violet-400"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider">
              Danh mục
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 block uppercase tracking-wider">
              Hạn hoàn thành
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </form>
  );
}
