"use client";

import { useEffect, useRef } from "react";
import { Todo } from "@/types/todo";

const CHECK_INTERVAL = 60 * 60 * 1000; // kiểm tra mỗi 1 giờ

function getDueSoon(todos: Todo[]): Todo[] {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return todos.filter(
    (t) => !t.completed && t.dueDate && t.dueDate > now && t.dueDate <= in24h
  );
}

function getOverdue(todos: Todo[]): Todo[] {
  const now = new Date();
  return todos.filter(
    (t) => !t.completed && t.dueDate && t.dueDate < now
  );
}

export function useTodoReminders(
  todos: Todo[],
  sendNotification: (title: string, opts?: NotificationOptions) => void,
  permission: string
) {
  const notifiedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (permission !== "granted") return;

    const checkReminders = () => {
      const dueSoon = getDueSoon(todos);
      const overdue = getOverdue(todos);

      dueSoon.forEach((todo) => {
        const key = `soon-${todo.id}`;
        if (!notifiedIds.current.has(key)) {
          notifiedIds.current.add(key);
          sendNotification("⏰ Công việc sắp đến hạn!", {
            body: `"${todo.text}" — còn dưới 24 giờ`,
            tag: key,
          });
        }
      });

      overdue.forEach((todo) => {
        const key = `overdue-${todo.id}`;
        if (!notifiedIds.current.has(key)) {
          notifiedIds.current.add(key);
          sendNotification("🔴 Công việc quá hạn!", {
            body: `"${todo.text}" đã quá hạn`,
            tag: key,
          });
        }
      });
    };

    checkReminders();
    const timer = setInterval(checkReminders, CHECK_INTERVAL);
    return () => clearInterval(timer);
  }, [todos, sendNotification, permission]);
}
