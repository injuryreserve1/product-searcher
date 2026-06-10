import { SidebarItem } from "@/shared/ui/SidebarItem/SidebarItem";
import { useLogout } from "../api/useLogout";
import cls from "./Logout.module.css";

const Logout = () => {
  const { mutate } = useLogout();
  return (
    <SidebarItem
      onClick={() => mutate()}
      icon="↪"
      text="Выйти"
      className={cls.exitColor}
    />
  );
};

export default Logout;
