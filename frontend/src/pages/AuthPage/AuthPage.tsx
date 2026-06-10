import { AuthForm } from "@/features/Auth";
import cls from "./AuthPage.module.css";

const AuthPage = () => {
  return (
    <div className={cls.Wrapper}>
      <AuthForm />
    </div>
  );
};

export default AuthPage;
