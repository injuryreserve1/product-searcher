import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./app/providers/RouteProvider/AppRoute.tsx";
import QueryProvider from "./app/providers/QueryProvider/QueryProvider.tsx";
import ThemeProvider from "./app/providers/ThemeProvider/ThemeProvider.tsx";
import AuthProvider from "./app/providers/AuthProvider/AuthProvider.tsx";
import { ErrorBoundary } from "./app/providers/ErrorBoundary/ErrorBoundary.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
    ,
  </StrictMode>,
);
