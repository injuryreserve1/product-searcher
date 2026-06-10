import { useTheme } from "@/app/providers/ThemeProvider/useTheme";
import { SidebarItem } from "../SidebarItem/SidebarItem";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <SidebarItem
      onClick={toggleTheme}
      icon={theme === "light" ? "☀️" : "🌙"}
      text={theme === "light" ? "Светлая тема" : "Темная тема"}
    />
  );
};

export default ThemeSwitcher;
