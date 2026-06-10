import type { SignupResponse } from "@/features/Auth";
import type { LoginResponse } from "@/features/Login";
import type { Settings } from "@/features/Settings";

export interface IUserCredentials {
  username: string;
  password?: string;
}

export interface IUserProfile {
  id: string;
  username: string;
}

export class AuthApi {
  private _baseUrl: string;

  constructor(url: string) {
    this._baseUrl = url;
  }

  private handleResponse = async <T>(res: Response): Promise<T> => {
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Ошибка сервера: ${res.status}`);
    }
    return res.json();
  };

  async signup(payload: IUserCredentials): Promise<SignupResponse> {
    const res = await fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return this.handleResponse<SignupResponse>(res);
  }

  async login(payload: IUserCredentials): Promise<LoginResponse> {
    const res = await fetch(`${this._baseUrl}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    return this.handleResponse<LoginResponse>(res);
  }

  async logout(): Promise<{ message: string }> {
    const res = await fetch(`${this._baseUrl}/logout`, {
      method: "POST",
      credentials: "include",
    });
    return this.handleResponse<{ message: string }>(res);
  }

  async getInfo() {
    const res = await fetch(`${this._baseUrl}/info`, {
      method: "GET",
      credentials: "include",
    });
    return this.handleResponse(res);
  }

  async changeInfo(settings: Settings) {
    const res = await fetch(`${this._baseUrl}/info-change`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ settings }),
    });
    return this.handleResponse(res);
  }
}

export const authApi = new AuthApi(
  `${import.meta.env.VITE_BACKEND_URL}api/v1/user`,
);
