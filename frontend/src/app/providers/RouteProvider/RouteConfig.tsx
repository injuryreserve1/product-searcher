import { AuthPageAsync } from "@/pages/AuthPage/AuthPage.async";
import { LoginPageAsync } from "@/pages/LoginPage/LoginPage.async";
import { MainPageAsync } from "@/pages/MainPage/MainPage.async";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";
import type { RouteProps } from "react-router";

export type AppRoutes = "auth" | "login" | "main" | "notFound";
export type AppRouteProps = RouteProps & {
  authOnly?: boolean;
};

export const RoutePath: Record<AppRoutes, string> = {
  auth: "/auth",
  login: "/login",
  main: "/main/:id",
  notFound: "*",
};

export const RouteConfig: Record<AppRoutes, AppRouteProps> = {
  auth: {
    path: RoutePath.auth,
    element: <AuthPageAsync />,
  },
  login: {
    path: RoutePath.login,
    element: <LoginPageAsync />,
  },
  main: {
    path: RoutePath.main,
    element: <MainPageAsync />,
    authOnly: true,
  },
  notFound: {
    path: RoutePath.notFound,
    element: <NotFoundPage />,
  },
};
