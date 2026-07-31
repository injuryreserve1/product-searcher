import { render, screen } from "@testing-library/react";
import { composeStories } from "@storybook/react";
import * as stories from "./Button.stories";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

const composed = composeStories(stories);

describe("Button Component", () => {
  it("должен рендерить обычную кнопку с текстом", () => {
    render(composed.Default());

    const buttonElement = screen.getByRole("button", { name: /кнопка/i });

    expect(buttonElement).toBeInTheDocument();
  });

  it("должен рендерить ссылку, если передан проп as='a'", () => {
    render(composed.AsLink());

    const linkElement = screen.getByRole("link", {
      name: /я ссылка на storybook/i,
    });

    expect(linkElement).toBeInTheDocument();

    expect(linkElement).toHaveAttribute("href", "https://js.org");
  });

  it("должен быть заблокирован, если передан проп disabled", () => {
    render(composed.Disabled());

    const buttonElement = screen.getByRole("button", {
      name: /заблокировано/i,
    });

    expect(buttonElement).toBeDisabled();
  });
});
