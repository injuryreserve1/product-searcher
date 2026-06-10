import { authApi } from "@/shared/api/AuthApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return authApi.logout();
    },
    onSuccess: () => {
      queryClient.clear();
      navigate("/login");
    },
    onError: (error) => {
      alert("Ошибка при входе: " + error.message);
    },
  });
};
