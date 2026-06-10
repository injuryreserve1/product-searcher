import { authApi } from "@/shared/api/AuthApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Settings } from "../model/settings";

export function useUserSettings() {
  return useQuery({
    queryKey: ["user", "settings"],
    queryFn: () => authApi.getInfo(),
    select: (data: Settings) => data.settings,
    staleTime: 5 * 60 * 1000,
  });
}

export function useChangeUserSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Settings) => authApi.changeInfo(settings),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "settings"] });
    },

    onError: (error: Error) => {
      console.error("Ошибка при сохранении настроек:", error.message);
    },
  });
}
