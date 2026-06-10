import { chatApi } from "@/shared/api/ChatApi";
import { useQuery } from "@tanstack/react-query";

export function useGetChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: () => chatApi.getChats(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetChat(id: string) {
  return useQuery({
    queryKey: ["chat", id],
    queryFn: () => chatApi.getChatById(id),
    staleTime: 1000 * 60 * 5,
  });
}
