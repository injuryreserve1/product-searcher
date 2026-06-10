import { authApi, type IUserCredentials } from "@/shared/api/AuthApi";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { LoginResponse } from "../model/Login";
import toast from "react-hot-toast";

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: IUserCredentials) => {
      return authApi.login(data);
    },
    onSuccess: (data: LoginResponse) => {
      navigate(`/main/${data.activeChatId}`);
    },
    onError: () => {
      toast.error("Неверный логин или пароль");
    },
  });
};
