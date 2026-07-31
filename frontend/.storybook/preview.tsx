import type { Preview } from "@storybook/react-vite";
import "./../src/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  globalTypes: {
    theme: {
      description: "Глобальная тема для компонентов",
      defaultValue: "light",
      toolbar: {
        title: "Тема",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "circlehollow", title: "Светлая" },
          { value: "dark", icon: "circle", title: "Темная" },
        ],
        // showName: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || "light";

      return (
        <div
          className={theme}
          style={{
            padding: "2rem",
            background: theme === "dark" ? "#1a1a1a" : "#ffffff",
            minHeight: "100vh",
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
