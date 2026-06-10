import { useState } from "react";
import PromptInput from "@/widget/PromptInput/PromptInput";

import cls from "./MainPage.module.css";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetChat } from "@/features/GetChat";
import QueryTextarea from "@/features/QueryTextarea/ui/QueryTextarea";
import SpecsTable from "@/features/SpecsTable";
import Settings from "@/features/Settings/ui/Settings";

const MainPage = () => {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const step = Number(params.get("step")) || 0;

  const { data: chatData } = useGetChat(id);
  // console.log("single data", chatData);

  const [userDraft, setUserDraft] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const changeStep = (newStep: number) => {
    setParams({ step: String(newStep) });
  };

  const handleSuccess = (aiText: string) => {
    setUserDraft(aiText);
    changeStep(1);
  };

  const handleReset = () => {
    changeStep(0);
  };

  return (
    <div className={cls.layout}>
      <main className={cls.main}>
        {step === 0 && (
          <PromptInput
            chatId={id}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onSuccess={handleSuccess}
          />
        )}
        {step === 1 && (
          <QueryTextarea
            chatData={chatData}
            userDraft={userDraft}
            onTextChange={setUserDraft}
            onSuccess={(newStep) => changeStep(newStep)}
            onBack={() => changeStep(0)}
            id={id!}
          />
        )}
        {step === 2 && <SpecsTable chatData={chatData} onReset={handleReset} />}
      </main>

      {isSettingsOpen && (
        <Settings
          onClose={() => setIsSettingsOpen(false)}
          authorId={chatData?.author}
        />
      )}
    </div>
  );
};

export default MainPage;
