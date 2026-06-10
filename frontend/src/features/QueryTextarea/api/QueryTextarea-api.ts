import { chatApi } from "@/shared/api/ChatApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ScrapingParams {
  chatId: string;
  text: string;
}

export const useScraping = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, text }: ScrapingParams) =>
      chatApi.startScraping(chatId, text),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chat", data._id] });
    },
  });
};
