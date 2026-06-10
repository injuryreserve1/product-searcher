import Button from "@/shared/ui/Button/Button";
import Card from "@/shared/ui/Card/Card";
import Input from "@/shared/ui/Input/Input";
import cls from "./AuthForm.module.css";
import { useAuth } from "../api/useAuth";
import { useFormik } from "formik";

export const AuthForm = () => {
  const authMutation = useAuth();

  const formik = useFormik({
    initialValues: { username: "", password: "" },
    onSubmit: (values) => {
      authMutation.mutate(values);
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
    <Card title="Зарегистрируйтесь">
      <form className={cls.Form} onSubmit={formik.handleSubmit}>
        <Input
          placeholder="Ваше имя"
          labelText="Ваше Имя"
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
          Зарегистрироваться
        </Button>
      </form>
    </Card>
  );
};
