import type { LoginResponse } from "@/shared/api/AuthApi";
import { createContext } from "react";

export interface AuthContextProps {
  userInfo: null | any;
  setUserInfo: (value: LoginResponse) => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);
AuthContext.displayName = "auth context";
