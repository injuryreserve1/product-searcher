import { test, expect } from "@playwright/test";

test.describe("Маршрутизация: Страница 404", () => {
  test("Должен отображать 404 и возвращать на логин при клике", async ({
    page,
  }) => {
    await page.goto("/some-broken-link-123");

    await expect(
      page.getByRole("heading", { name: "404 - Страница не найдена" }),
    ).toBeVisible();
    await expect(page.getByText("Похоже, вы ошиблись в адресе")).toBeVisible();

    const backButton = page.getByRole("button", { name: "Вернуться в чат" });
    await backButton.click();

    await page.waitForURL(/\/login/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
  });
});
