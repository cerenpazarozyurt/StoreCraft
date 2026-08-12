"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodos, updateTodo, Todo } from "@/lib/todos";

export function useTodos() {
  const queryClient = useQueryClient();

  const { data: todos, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: () => getTodos(10),
    staleTime: 1000 * 60 * 2,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) => updateTodo(id, completed),
    //api isteğe gitmeden önce çalışan kısım (optimistic update)
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });
      const previous = queryClient.getQueryData<Todo[]>(["todos"]);

      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
      );

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["todos"], context.previous);
      }
    },
  });

  const incompleteCount = todos?.filter((t) => !t.completed).length ?? 0; //zil simgesinin üstündeki

  return {
    todos: todos ?? [],
    isLoading,
    toggleTodo: (id: number, completed: boolean) => toggleMutation.mutate({ id, completed }),
    incompleteCount,
  };
}