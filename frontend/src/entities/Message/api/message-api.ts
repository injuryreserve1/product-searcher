import { chatApi } from "@/shared/api/ChatApi";
import { queryClient } from "@/shared/api/query-client";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useSendMessage(chatId: string) {
  return useMutation({
    mutationFn: ({ text, file }: { text?: string; file?: File }) =>
      chatApi.postMessage(chatId, text, file),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] });

      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },

    onError: (error: Error) => {
      console.log("error", error);
      const errorMessage = error.message || "";
      if (errorMessage.includes("403")) {
        toast.error("API заблокирован в РФ, воспользуйтесь VPN", {
          icon: "🌐",
        });
      }

      if (errorMessage.includes("429")) {
        toast.error("Слишком много запросов, попробуйте позже", { icon: "⏳" });
      }
    },
  });
}
