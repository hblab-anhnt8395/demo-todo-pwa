"use client";

import { Todo } from "@/types/todo";
import { TodoItem } from "./TodoItem";
import { ClipboardList } from "lucide-react";

interface Props {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export function TodoList({ todos, onToggle, onDelete, onEdit }: Props) {
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <ClipboardList size={28} className="text-slate-300 dark:text-slate-600" />
        </div>
        <p className="text-slate-400 dark:text-slate-500 font-medium">Chưa có công việc nào</p>
        <p className="text-slate-300 dark:text-slate-600 text-sm mt-1">Thêm công việc mới để bắt đầu!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
