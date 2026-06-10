import { useState, type DragEvent } from "react";
import cls from "./PromptInput.module.css";
import { useSendMessage } from "@/entities/Message/api/message-api";
import Button from "@/shared/ui/Button/Button";
import Input from "@/shared/ui/Input/Input";
import Loader from "@/shared/ui/Loader/Loader";

interface PromptInputProps {
  chatId: string;
  onOpenSettings: () => void;
  onSuccess: (v2: string) => void;
}

const PromptInput = ({
  chatId,
  onOpenSettings,
  onSuccess,
}: PromptInputProps) => {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const { mutate, isPending } = useSendMessage(chatId);

  const handleSend = () => {
    if ((!text.trim() && !selectedFile) || !chatId) return;

    mutate(
      { text: text.trim(), file: selectedFile || undefined },
      {
        onSuccess: (data) => {
          console.log("data", data);
          const urlMsg = data.messages.find((m) => m.stage === "formattedURL");

          setText("");
          setSelectedFile(null);
          onSuccess(urlMsg.text);
        },
      },
    );
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setSelectedFile(droppedFile);
    }
  };

  const removeFile = () => setSelectedFile(null);

  return (
    <div
      className={`${cls.inputWrapper} ${isDragActive ? cls.dragActive : ""}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {selectedFile && (
        <div className={cls.filePreview}>
          <span className={cls.fileName}>📄 {selectedFile.name}</span>
          <button className={cls.removeBtn} onClick={removeFile}>
            ✕
          </button>
        </div>
      )}
      <div className={cls.inputContainer}>
        <Button onClick={onOpenSettings}>⚙</Button>
        <Input
          value={text}
          disabled={isPending}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            isPending
              ? "Анализирую данные..."
              : isDragActive
                ? "Бросайте файл сюда..."
                : "Напишите характеристики товара..."
          }
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <Button onClick={handleSend} disabled={isPending}>
          ➤
        </Button>
      </div>
      <div className={cls.uploadHint}>Можно перетащить файл для анализа</div>
      {isPending && <Loader />}
    </div>
  );
};

export default PromptInput;
