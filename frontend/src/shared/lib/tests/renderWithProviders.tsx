import React from "react";
import { render, renderHook } from "@testing-library/react";
import { TestWrapper } from "./TestWrapper";

export const renderTestHook = <Result, Props>(
  hook: (props: Props) => Result,
) => {
  return renderHook(hook, { wrapper: TestWrapper });
};

export const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestWrapper });
};
