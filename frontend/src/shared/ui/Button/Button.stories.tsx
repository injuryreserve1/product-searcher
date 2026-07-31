import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Кнопка",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AsLink: Story = {
  args: {
    as: "a",
    href: "https://js.org",
    target: "_blank",
    children: "Я ссылка на Storybook",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Заблокировано",
  },
};
