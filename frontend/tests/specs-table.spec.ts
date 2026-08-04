import { test, expect } from "@playwright/test";

test.describe("Компонент SpecsTable — Результаты поиска", () => {
  const mockChatId = "65c2cc629e4d58001f35ab7a";

  test("Должен сбрасывать шаг при нажатии на кнопку 'Новый поиск'", async ({
    page,
  }) => {
    await page.goto(`/main/${mockChatId}?step=2`);

    await page.locator("button:has-text('Новый поиск')").click();

    await page.waitForURL(new RegExp(`.*\\/main\\/${mockChatId}\\?step=0.*`));
    await expect(page).toHaveURL(
      new RegExp(`.*\\/main\\/${mockChatId}\\?step=0.*`),
    );
  });
});
