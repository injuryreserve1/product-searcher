import cls from "./Message.module.css";
import type { IMessage } from "../model/IMessage";

interface Props {
  msg: IMessage;
  author?: { username: string };
}

const Message = ({ msg, author }: Props) => {
  const userLetter = author?.username
    ? author.username.charAt(0).toUpperCase()
    : "U";
  return (
    <div
      key={msg._id}
      className={msg.role === "user" ? cls.userMessage : cls.aiMessage}
    >
      <div className={msg.role === "user" ? cls.userAvatar : cls.aiAvatar}>
        {msg.role === "user" ? userLetter : "A"}
      </div>

      <div className={msg.role === "assistant" ? cls.tableCard : ""}>
        <p className={cls.messageText}>{msg.text}</p>

        {msg.role === "assistant" && (
          <table className={cls.table}>{/* Тут будет  логика таблицы */}</table>
        )}
      </div>
    </div>
  );
};

export default Message;
