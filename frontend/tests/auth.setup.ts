import { test as setup } from "@playwright/test";

export const authFile = "playwright/.auth/user.json";

setup("авторизация в системе", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("ваше имя", { exact: false }).fill("765");
  await page.getByLabel("Пароль").fill("765");
  await page.getByRole("button", { name: "Войти в аккаунт" }).click();

  await page.waitForURL(/.*\/main\/.*/);

  await page.context().storageState({ path: authFile });
});
