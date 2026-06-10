import Button from "@/shared/ui/Button/Button";
import Card from "@/shared/ui/Card/Card";
import Input from "@/shared/ui/Input/Input";
import cls from "./LoginForm.module.css";
import { useLogin } from "../api/useLogin";
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";

export const LoginForm = () => {
  const loginMutation = useLogin();

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    onSubmit: (values) => {
      loginMutation.mutate(values);
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.username) {
        errors.username = "Имя обязательно";
      } else if (values.username.length < 3) {
        errors.username = "Минимум 3 символа";
      }

      if (!values.password) {
        errors.password = "Введите пароль";
      }

      return errors;
    },
  });

  return (
    <Card title="Войдите, чтобы начать">
      <form className={cls.Form} onSubmit={formik.handleSubmit}>
        <Input
          placeholder="Ваше Имя"
          labelText="ваше имя"
          {...formik.getFieldProps("username")}
          error={formik.touched.username && formik.errors.username}
        />

        <Input
          type="password"
          placeholder="••••••••"
          labelText="Пароль"
          {...formik.getFieldProps("password")}
          error={formik.touched.password && formik.errors.password}
        />

        <Button type="submit" disabled={!formik.isValid}>
          Войти в аккаунт
        </Button>
      </form>

      <p className={cls.FooterText}>
        Нет аккаунта?{" "}
        <Button as={NavLink} to="/auth" className={cls.Link}>
          Создать сейчас
        </Button>
      </p>
    </Card>
  );
};
