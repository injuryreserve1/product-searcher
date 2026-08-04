import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Страница авторизации (Компонент LoginForm)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("Ошибки валидации полей формы", async ({ page }) => {
    const nameInput = page.getByLabel("ваше имя", { exact: false });
    const passwordInput = page.getByLabel("Пароль");
    const submitButton = page.getByRole("button", { name: "Войти в аккаунт" });

    await nameInput.focus();
    await nameInput.blur();
    await expect(page.getByText("Имя обязательно")).toBeVisible();
    await expect(submitButton).toBeDisabled();

    await nameInput.fill("Я");
    await nameInput.blur();
    await expect(page.getByText("Минимум 3 символа")).toBeVisible();

    await nameInput.fill("Иван");
    await passwordInput.focus();
    await passwordInput.blur();
    await expect(page.getByText("Введите пароль")).toBeVisible();
    await expect(submitButton).toBeDisabled();
  });

  test("Переход на страницу регистрации по кнопке в футере", async ({
    page,
  }) => {
    const registerLink = page.getByRole("link", { name: "Создать сейчас" });

    await registerLink.click();

    await expect(page).toHaveURL("/auth");
  });
});
