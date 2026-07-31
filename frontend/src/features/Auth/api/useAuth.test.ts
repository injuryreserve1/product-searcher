import { waitFor } from "@testing-library/react";
import { useAuth } from "./useAuth";
import { renderTestHook } from "@/shared/lib/tests/renderWithProviders";
import { authApi } from "@/shared/api/AuthApi";
import { describe, it, expect, vi, beforeEach } from "vitest";
import toast from "react-hot-toast";
import type { SignupResponse } from "../model/Auth";

vi.mock("@/shared/api/AuthApi", () => ({ authApi: { signup: vi.fn() } }));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("react-hot-toast", () => ({ default: { error: vi.fn() } }));

describe("useAuth хук", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("должен перенаправлять на /login при успешной регистрации", async () => {
    vi.mocked(authApi.signup).mockResolvedValue({
      success: true,
    } as unknown as never);

    const { result } = renderTestHook(() => useAuth());

    result.current.mutate({
      email: "test@test.com",
      password: "123",
    } as unknown as SignupResponse);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("должен показывать ошибку toast при сбое запроса", async () => {
    vi.mocked(authApi.signup).mockRejectedValue(new Error());

    const { result } = renderTestHook(() => useAuth());

    result.current.mutate({
      email: "error@test.com",
      password: "123",
    } as unknown as SignupResponse);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Возможно такой пользователь уже существует",
      );
    });
  });
});
