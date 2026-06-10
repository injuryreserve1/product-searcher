import { Outlet } from "react-router-dom";
import { useTheme } from "./providers/ThemeProvider/useTheme";
import { Toaster } from "react-hot-toast";

function App() {
  const { theme } = useTheme();
  return (
    <div className={theme == "light" ? "" : "dark"}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <Outlet />
    </div>
  );
}

export default App;
