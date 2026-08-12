import { api } from "@/lib/api";

export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

interface TodosResponse {
  todos: Todo[];
  total: number;
}

export async function getTodos(limit = 10): Promise<Todo[]> {
  const data = await api.get<TodosResponse>(`/todos?limit=${limit}`);
  return data.todos;
}

export async function updateTodo(id: number, completed: boolean): Promise<Todo> {
  return api.put<Todo>(`/todos/${id}`, { completed });
}