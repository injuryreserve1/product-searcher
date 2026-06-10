import { LoginForm } from "@/features/Login";
import cls from "./LoginPage.module.css";

const LoginPage = () => {
  return (
    <div className={cls.Wrapper}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
