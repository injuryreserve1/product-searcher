import Button from "@/shared/ui/Button/Button";
import cls from "./QueryTextarea.module.css";
import { useScraping } from "../api/QueryTextarea-api";
import { useMemo } from "react";
import Loader from "@/shared/ui/Loader/Loader";
import type { IChat } from "@/features/GetChat";

interface QueryTextareaProps {
  chatData: IChat;
  userDraft: string | null;
  onTextChange: (text: string) => void;
  onSuccess: (step: number) => void;
  onBack: () => void;
  id: string;
}

const QueryTextarea = ({
  chatData,
  userDraft,
  onTextChange,
  onSuccess,
  onBack,
  id,
}: QueryTextareaProps) => {
  const { mutate: startScraping, isPending: isScrapingLoading } = useScraping();

  const currentQuery = useMemo(() => {
    if (userDraft !== null) return userDraft;

    if (chatData?.messages) {
      const draftMsg =
        chatData.messages.find((m) => m.stage === "formattedURL") ||
        chatData.messages.filter((m) => m.stage !== "result").pop();

      if (draftMsg?.text) {
        return draftMsg.text.replace(/^["']|["']$/g, "").trim();
      }
    }

    return "";
  }, [chatData, userDraft]);

  const handleStartScraping = () => {
    startScraping(
      { chatId: id, text: currentQuery },
      {
        onSuccess: () => {
          onSuccess(2);
        },
      },
    );
  };

  return (
    <div className={cls.queryWrapper}>
      {isScrapingLoading && <Loader />}
      <div className={cls.queryHeader}>
        <h3>Проверьте сформированный запрос</h3>
        <p>Вы можете отредактировать его перед началом поиска аналогов</p>
      </div>

      <textarea
        className={cls.mainQueryInput}
        value={currentQuery}
        onChange={(e) => onTextChange(e.target.value)}
        rows={5}
        placeholder="Введите поисковый запрос..."
      />

      <div className={cls.actions}>
        <Button disabled={isScrapingLoading} onClick={onBack}>
          Назад
        </Button>
        <Button
          onClick={handleStartScraping}
          disabled={isScrapingLoading || !currentQuery.trim()}
        >
          Найти аналоги
        </Button>
      </div>
    </div>
  );
};

export default QueryTextarea;
