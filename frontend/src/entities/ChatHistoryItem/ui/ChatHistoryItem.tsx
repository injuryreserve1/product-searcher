import type { ChatItemProps } from "../model/ChatItemProps";
import cls from "./ChatHistoryItem.module.css";

const ChatHistoryItem = ({ id, title, isActive, onSelect }: ChatItemProps) => {
  return (
    <li
      className={isActive ? cls.historyItemActive : cls.historyItem}
      onClick={() => onSelect(id)}
    >
      {title || "Новый чат"}
    </li>
  );
};

export default ChatHistoryItem;
