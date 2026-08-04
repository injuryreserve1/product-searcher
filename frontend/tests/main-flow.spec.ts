import { test, expect } from "@playwright/test";

test.describe("Главный рабочий процесс (Мастер шагов с моканием ИИ)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("ваше имя", { exact: false }).fill("765");
    await page.getByLabel("Пароль").fill("765");
    await page.getByRole("button", { name: "Войти в аккаунт" }).click();

    await page.waitForURL(/.*\/main\/.*/, { timeout: 7000 });
  });

  test("Должен отправлять промпт, перехватывать ответ ИИ и переходить на шаг 1", async ({
    page,
  }) => {
    // 🔥 2. НАСТРОЙКА МОКА ДЛЯ ОТВЕТА ИИ
    // Перехватываем запрос от useSendMessage (подстройте путь под ваш message-api)
    await page.route(
      "http://localhost:3000/api/v1/chat/formSearchQuery",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            // Имитируем структуру ответа бэкенда, которую ждет ваш handleSuccess: data.messages.find(...)
            messages: [
              {
                stage: "formattedURL",
                text: "Вот отформатированный ответ от искусственного интеллекта для шага 1!",
              },
            ],
          }),
        });
      },
    );

    // --- ШАГ 0 ---
    // Проверяем, что заголовок шага 0 виден на десктопе
    await expect(
      page.locator("text=Введите характеристики или перетащите файл"),
    ).toBeVisible();

    // 3. НАХОДИМ ИНПУТ ПО ПЛЕЙСХОЛДЕРУ (Исправленный шаг)
    const promptInput = page.getByPlaceholder(
      "Напишите характеристики товара...",
    );
    await expect(promptInput).toBeVisible();

    // Заполняем поле характеристиками
    await promptInput.fill("Тестовые характеристики десктопного процессора");

    // 4. КЛИКАЕМ НА КНОПКУ ОТПРАВКИ (Иконка стрелочки ➤)
    const sendButton = page.locator("button:has-text('➤')");
    await sendButton.click();

    // --- ШАГ 1 ---
    // После клика улетает запрос, срабатывает наш мок, вызывается onSuccess(urlMsg.text)
    // и MainPage переключает URL на step=1
    await page.waitForURL(/.*step=1.*/, { timeout: 10000 });

    // Проверяем, что заголовок шага 0 скрылся
    await expect(
      page.locator("text=Введите характеристики или перетащите файл"),
    ).not.toBeVisible();

    // Проверяем, что в QueryTextarea на первом шаге подставился наш замоканный текст
    const queryTextarea = page.locator("textarea").first();
    await expect(queryTextarea).toHaveValue(
      "Вот отформатированный ответ от искусственного интеллекта для шага 1!",
    );
  });
});
