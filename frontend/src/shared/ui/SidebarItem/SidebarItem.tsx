import type { ReactNode } from "react";
import cls from "./SidebarItem.module.css";

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  onClick?: () => void;
  className?: string;
}

export const SidebarItem = ({
  icon,
  text,
  onClick,
  className,
}: SidebarItemProps) => (
  <div className={`${cls.sidebarAction} ${className}`} onClick={onClick}>
    <div className={cls.iconWrapper}>{icon}</div>
    <span>{text}</span>
  </div>
);
