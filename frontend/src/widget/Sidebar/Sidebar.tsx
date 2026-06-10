import cls from "./Sidebar.module.css";
import Logout from "@/features/Logout";
import ThemeSwitcher from "@/shared/ui/ThemeSwitcher/ThemeSwitcher";
import Button from "@/shared/ui/Button/Button";
import ChatHistory from "../ChatHistory/ChatHistory";
import { useCreateChat, type Chat } from "@/entities/ChatHistoryItem";

interface Props {
  data: Chat[];
  activeChatId?: string;
  onSelectChat: (chatId: string) => void;
}

const Sidebar = ({ data, activeChatId, onSelectChat }: Props) => {
  const { mutate: createChat } = useCreateChat();
  const handleCreateChat = () => {
    createChat(undefined, {
      onSuccess: (newChat) => {
        if (newChat?._id) {
          onSelectChat(newChat._id);
        }
      },
    });
  };
  return (
    <aside className={cls.sidebar}>
      <Button onClick={handleCreateChat}>Новый чат</Button>
      <ChatHistory
        data={data}
        activeChatId={activeChatId}
        onSelectChat={onSelectChat}
      />
      <div className={cls.sidebarBottom}>
        <ThemeSwitcher />
        <Logout />
      </div>
    </aside>
  );
};

export default Sidebar;
