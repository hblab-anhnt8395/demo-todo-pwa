"use client";

import { CheckCircle2, Circle, ListTodo } from "lucide-react";

interface Props {
  total: number;
  active: number;
  completed: number;
}

export function StatsBar({ total, active, completed }: Props) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          Tiến độ hôm nay
        </h2>
        <span className="text-2xl font-bold text-violet-600">{percent}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            <ListTodo size={15} className="text-slate-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{total}</p>
            <p className="text-xs text-slate-400">Tổng</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
            <Circle size={15} className="text-amber-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{active}</p>
            <p className="text-xs text-slate-400">Đang làm</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <CheckCircle2 size={15} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{completed}</p>
            <p className="text-xs text-slate-400">Hoàn thành</p>
          </div>
        </div>
      </div>
    </div>
  );
}
