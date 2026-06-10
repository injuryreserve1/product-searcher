import ChatItem from "@/entities/ChatHistoryItem/ui/ChatHistoryItem";
import cls from "./ChatHistory.module.css";
import type { Chat } from "@/entities/ChatHistoryItem";

interface Props {
  data: Chat[];
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
}

const ChatHistory = ({ data = [], activeChatId, onSelectChat }: Props) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const isToday = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  };

  const todayChats = sortedData?.filter((chat) => isToday(chat.createdAt));
  const olderChats = sortedData?.filter((chat) => !isToday(chat.createdAt));
  return (
    <div className={cls.sidebarTop}>
      {todayChats.length > 0 && (
        <>
          <h2 className={cls.sidebarTitle}>Сегодня</h2>
          <ul className={cls.historyList}>
            {todayChats.map((chat) => (
              <ChatItem
                key={chat._id}
                id={chat._id}
                title={chat.title}
                isActive={chat._id === activeChatId}
                onSelect={onSelectChat}
              />
            ))}
          </ul>
        </>
      )}

      {olderChats.length > 0 && (
        <>
          <h2 className={cls.sidebarTitle}>Ранее</h2>
          <ul className={cls.historyList}>
            {olderChats.map((chat) => (
              <ChatItem
                key={chat._id}
                id={chat._id}
                title={chat.title}
                isActive={chat._id === activeChatId}
                onSelect={onSelectChat}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ChatHistory;
