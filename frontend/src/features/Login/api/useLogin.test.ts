import { waitFor } from "@testing-library/react";
import { useLogin } from "./useLogin";
import { renderTestHook } from "@/shared/lib/tests/renderWithProviders";
import { authApi, type IUserCredentials } from "@/shared/api/AuthApi";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { LoginResponse } from "../model/Login";
import toast from "react-hot-toast";

vi.mock("@/shared/api/AuthApi", () => ({
  authApi: {
    login: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("react-hot-toast", () => ({
  default: { error: vi.fn() },
}));

describe("useLogin хук", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("должен перенаправлять в активный чат при успешном логине", async () => {
    const testChatId = "42";

    const mockResponse: Partial<LoginResponse> = { activeChatId: testChatId };

    vi.mocked(authApi.login).mockResolvedValue(
      mockResponse as unknown as LoginResponse,
    );

    const { result } = renderTestHook(() => useLogin());

    result.current.mutate({
      email: "user@test.com",
      password: "password",
    } as unknown as IUserCredentials);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(`/main/${testChatId}`);
    });
  });

  it("должен показывать ошибку toast при неверных данных", async () => {
    vi.mocked(authApi.login).mockRejectedValue(new Error("Unauthorized"));

    const { result } = renderTestHook(() => useLogin());

    result.current.mutate({
      email: "wrong@test.com",
      password: "wrong",
    } as unknown as IUserCredentials);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Неверный логин или пароль");
    });
  });
});
