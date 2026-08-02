import { test, expect } from "@playwright/test";

test.describe("Страница регистрации (Компонент AuthForm)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/auth");
  });

  test("Успешная отправка формы при валидных данных", async ({ page }) => {
    const nameInput = page.getByLabel("Ваше Имя");
    const passwordInput = page.getByLabel("Пароль");
    const submitButton = page.getByRole("button", {
      name: "Зарегистрироваться",
    });

    const randomName = `User_${Math.floor(Math.random() * 10000)}`;

    await nameInput.fill(randomName);
    await passwordInput.fill("my-strong-password-123");

    await expect(submitButton).toBeEnabled();

    await Promise.all([
      page.waitForResponse(
        (response) =>
          (response.url().includes("/signup") && response.status() === 200) ||
          response.status() === 201,
      ),
      submitButton.click(),
    ]);

    await expect(page).toHaveURL("/login", { timeout: 5000 });
  });

  test("Ошибки валидации Formik при некорректном вводе", async ({ page }) => {
    const nameInput = page.getByLabel("Ваше Имя");
    const passwordInput = page.getByLabel("Пароль");
    const submitButton = page.getByRole("button", {
      name: "Зарегистрироваться",
    });

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

  test("Отображение ошибки бэкенда (toast), если имя уже занято", async ({
    page,
  }) => {
    await page.getByLabel("Ваше Имя").fill("ExistingUser");
    await page.getByLabel("Пароль").fill("anypassword");

    await page.getByRole("button", { name: "Зарегистрироваться" }).click();

    await expect(
      page.getByText("Возможно такой пользователь уже существует"),
    ).toBeVisible();

    await expect(page).not.toHaveURL("/login");
  });
});
