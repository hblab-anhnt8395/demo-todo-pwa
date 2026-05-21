export type Priority = "low" | "medium" | "high";
export type Category = "personal" | "work" | "shopping" | "health" | "other";
export type FilterType = "all" | "active" | "completed";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: Date;
  dueDate?: Date;
}
