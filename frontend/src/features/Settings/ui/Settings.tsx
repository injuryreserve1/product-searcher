import { useState, type MouseEvent } from "react";
import cls from "./Settings.module.css";
import Input from "@/shared/ui/Input/Input";
import Button from "@/shared/ui/Button/Button";
import { useChangeUserSettings, useUserSettings } from "../api/settings-api";

interface ModalProps {
  onClose: () => void;
  authorId: string;
}

const Settings = ({ onClose }: ModalProps) => {
  const { data: settings } = useUserSettings();
  const { mutate } = useChangeUserSettings();
  console.log("settings", settings);

  const [formState, setFormState] = useState({
    baseUrl: "",
    modelName: "",
    apiKey: "",
  });

  const handleSave = () => {
    const finalData = {
      baseUrl: formState?.baseUrl || settings?.baseUrl,
      modelName: formState?.modelName || settings?.modelName,
      apiKey: formState?.apiKey || settings?.apiKey,
    };
    // console.log("final", finalData);
    mutate({ settings: finalData }, { onSuccess: onClose });
  };

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
              defaultValue={settings?.baseUrl}
              onChange={(e) =>
                setFormState((p) => ({ ...p, baseUrl: e.target.value }))
              }
            />
          </div>

          <div className={cls.inputGroup}>
            <Input
              labelText="Модель"
              type="text"
              id="model-name"
              placeholder="gpt-4o"
              defaultValue={settings?.modelName}
              onChange={(e) =>
                setFormState((p) => ({ ...p, modelName: e.target.value }))
              }
            />
          </div>
          <div className={cls.inputGroup}>
            <Input
              labelText="API Ключ"
              type="password"
              id="api-key"
              placeholder="sk-..."
              defaultValue={settings?.apiKey}
              onChange={(e) =>
                setFormState((p) => ({ ...p, apiKey: e.target.value }))
              }
            />
          </div>
        </div>

        <footer className={cls.modalFooter}>
          <Button type="button" className={cls.btnPrimary} onClick={handleSave}>
            Сохранить изменения
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default Settings;
