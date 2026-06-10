import { chatApi } from "@/shared/api/ChatApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => chatApi.createChat(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (error) => {
      console.error("Ошибка при создании чата через TanStack Query:", error);
    },
  });
};
