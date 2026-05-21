"use client";

import { Search, Trash2 } from "lucide-react";
import { FilterType } from "@/types/todo";
import clsx from "clsx";

interface Props {
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  completedCount: number;
  onClearCompleted: () => void;
}

const FILTERS: { value: FilterType; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Đang làm" },
  { value: "completed", label: "Hoàn thành" },
];

export function FilterBar({
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  completedCount,
  onClearCompleted,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm..."
          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder:text-slate-400"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 gap-1">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              filter === f.value
                ? "bg-violet-600 text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Clear completed */}
      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-200 transition"
        >
          <Trash2 size={14} />
          Xóa ({completedCount})
        </button>
      )}
    </div>
  );
}
