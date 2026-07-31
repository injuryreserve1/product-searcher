import type { Meta, StoryObj } from "@storybook/react-vite";
import Input from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    placeholder: "Введите текст...",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    labelText: "Имя пользователя",
    placeholder: "Например, ivan_ivanov",
  },
};

export const WithErrorText: Story = {
  args: {
    labelText: "Электронная почта",
    value: "invalid-email@",
    error: "Некорректный формат email",
  },
};

export const WithErrorBoolean: Story = {
  args: {
    labelText: "Пароль",
    placeholder: "Минимум 8 символов",
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    labelText: "Заблокированное поле",
    value: "Этот текст нельзя редактировать",
    disabled: true,
  },
};
