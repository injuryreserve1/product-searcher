import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import { RouteConfig } from "./RouteConfig";
import App from "@/app/App";
import { ProtectedRoute } from "./ProtectedRoute";
// import AuthPage from "@/pages/AuthPage/AuthPage";

const AppRouter = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route index element={<Navigate to="/login" replace />} />
        {Object.values(RouteConfig).map(({ element, path, authOnly }) => (
          <Route
            key={path}
            path={path}
            element={
              authOnly ? <ProtectedRoute>{element}</ProtectedRoute> : element
            }
          />
        ))}
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
};

export default AppRouter;
