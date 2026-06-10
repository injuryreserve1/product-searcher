import type { MouseEvent } from "react";
import cls from "./Modal.module.css";
import Input from "@/shared/ui/Input/Input";
import Button from "@/shared/ui/Button/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({ isOpen, onClose }: ModalProps) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={cls.overlay} onClick={handleOverlayClick}>
      <div className={cls.modalContent}>
        <header className={cls.modalHeader}>
          <h2 className={cls.HeaderText}>Параметры провайдера</h2>
          <button type="button" className={cls.closeBtn} onClick={onClose}>
            &times;
          </button>
        </header>

        <div className={cls.modalBody}>
          <div className={cls.inputGroup}>
            <Input
              labelText="URL провайдера"
              type="text"
              id="provider-url"
              placeholder="https://api.openai.com/v1"
            />
          </div>

          <div className={cls.inputGroup}>
            <Input
              labelText="Модель"
              type="text"
              id="model-name"
              placeholder="gpt-4o"
            />
          </div>
        </div>

        <footer className={cls.modalFooter}>
          <Button type="button" className={cls.btnPrimary} onClick={onClose}>
            Сохранить изменения
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default Modal;
