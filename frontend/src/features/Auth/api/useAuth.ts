import { authApi } from "@/shared/api/AuthApi";
import type { SignupResponse } from "../model/Auth";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useAuth = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: SignupResponse) => {
      return authApi.signup(data);
    },
    onSuccess: () => {
      navigate("/login");
    },
    onError: () => {
      toast.error("Возможно такой пользователь уже существует");
    },
  });
};
