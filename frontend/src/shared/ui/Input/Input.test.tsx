import { render, screen } from "@testing-library/react";
import { composeStories } from "@storybook/react";
import * as stories from "./Input.stories";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import type { ElementType } from "react";

const { WithErrorText } = composeStories(stories) as Record<string, ElementType>;


describe("Input Component", () => {
  it("должен отображать текст ошибки", () => {
    render(<WithErrorText />);

    const errorMessage = screen.getByText("Некорректный формат email");
    expect(errorMessage).toBeInTheDocument();
  });
});