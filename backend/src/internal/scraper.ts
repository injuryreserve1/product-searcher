import playwright from "playwright";
import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";

import { args, headers } from "./settings";
import { callLLM } from "./callLLM";
import { VALIDATE_SYSTEM_PROMPT } from "./prompts";

chromium.use(stealth());

export async function search(item: any) {
  const browser = await playwright["chromium"].launch({
    headless: false,
    slowMo: 150,
    args: args,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const query = encodeURIComponent(item + " -site:ozon.ru");
    const url = `https://html.duckduckgo.com/html/?q=${query}&kl=ru-ru`;

    await page.goto(url);

    const results = await page.$$eval(".result", (elements) => {
      return elements
        .slice(0, 5)
        .map(
          (el) => el.querySelector(".result__url")?.textContent?.trim() || "",
        )
        .filter((url) => url);
    });

    return results;
  } catch (error) {
    console.error("Ошибка при поиске!!", error);
    return [];
  } finally {
    await context.close();
    await browser.close();
  }
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// export async function checkSites(origSpecs: any, sites: any, options: any) {
//   if (!Array.isArray(sites) || sites.length === 0) {
//     console.error("[scraper] Список сайтов пуст или некорректен");
//     return [];
//   }

//   const validSites = sites.map((url) =>
//     url.startsWith("http") ? url : `https://${url}`,
//   );

//   const browser = await chromium.launch({ headless: false, args: args });
//   const context = await browser.newContext();
//   const page = await context.newPage();
//   await page.setExtraHTTPHeaders(headers);

//   const results = [];

//   try {
//     for (const targetUrl of validSites) {
//       console.log(`Открываю: ${targetUrl}`);

//       try {
//         await delay(2000);

//         await page.goto(targetUrl, {
//           waitUntil: "domcontentloaded",
//           timeout: 40000,
//         });

//         const productLinks = await page.evaluate(() => {
//           const selectors = [
//             'a[href*="product"]',
//             'a[href*="card"]',
//             'a[href*="item"]',
//           ];
//           const links = Array.from(
//             document.querySelectorAll(selectors.join(",")),
//           )
//             .map((a) => (a as HTMLAnchorElement).href)
//             .filter(
//               (value, index, self) => value && self.indexOf(value) === index,
//             );

//           return links.slice(0, 3);
//         });

//         const textContent = await page.evaluate(() => {
//           const scripts = document.querySelectorAll(
//             "script, style, nav, footer, header, aside, form, noscript, img",
//           );
//           scripts.forEach((s) => s.remove());
//           return document.body.innerText.replace(/\s+/g, " ").trim();
//         });

//         const truncatedContent = textContent.substring(0, 7000);
//         const llmResponse: any = await callLLM(
//           VALIDATE_SYSTEM_PROMPT,
//           `original: ${origSpecs}, page: ${truncatedContent}`,
//           options,
//         );

//         console.log("otvet llM", llmResponse);

//         let parsedResult = [];
//         try {
//           const jsonMatch =
//             typeof llmResponse === "string"
//               ? llmResponse.match(/\[.*\]/s)?.[0]
//               : null;

//           if (jsonMatch) {
//             parsedResult = JSON.parse(jsonMatch);
//           } else if (Array.isArray(llmResponse)) {
//             parsedResult = llmResponse;
//           }
//         } catch (e) {
//           console.warn(
//             `Не удалось распарсить JSON для ${targetUrl}, пропускаю...`,
//           );
//           continue;
//         }

//         if (Array.isArray(parsedResult) && parsedResult.length > 0) {
//           const enrichedResults = parsedResult.map((item) => ({
//             ...item,
//             url: targetUrl,
//           }));

//           results.push(...enrichedResults);
//           console.log(
//             `\nДобавлен результат с ${targetUrl}. Всего: ${results.length}`,
//           );
//         }
//       } catch (siteError: any) {
//         console.error(
//           `Ошибка при обработке страницы ${targetUrl}:`,
//           siteError.message,
//         );
//         continue;
//       }
//     }
//     return results;
//   } catch (error) {
//     console.error("Ошибка в checkSites:", error);
//     return results;
//   } finally {
//     await context.close();
//     await browser.close();
//   }
// }

export async function checkSites(origSpecs: any, sites: any, options: any) {
  if (!Array.isArray(sites) || sites.length === 0) {
    console.error("[scraper] Список сайтов пуст или некорректен");
    return [];
  }

  const validSites = sites.map((url) =>
    url.startsWith("http") ? url : `https://${url}`,
  );

  const browser = await chromium.launch({ headless: false, args: args });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setExtraHTTPHeaders(headers);

  async function getAnalysis(url: string, pageInstance: any) {
    try {
      const textContent = await pageInstance.evaluate(() => {
        const scripts = document.querySelectorAll(
          "script, style, nav, footer, header, aside, form, noscript, img, iframe",
        );
        scripts.forEach((s) => s.remove());
        return document.body.innerText.replace(/\s+/g, " ").trim();
      });

      const truncatedContent = textContent.substring(0, 7000);

      const llmResponse = await callLLM(
        VALIDATE_SYSTEM_PROMPT,
        `original: ${origSpecs}, page: ${truncatedContent}`,
        options,
      );

      console.log(`[LLM] Ответ для ${url} получен`);

      let parsedResult = [];
      const jsonMatch =
        typeof llmResponse === "string"
          ? llmResponse.match(/\[.*\]/s)?.[0]
          : null;

      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch);
      } else if (Array.isArray(llmResponse)) {
        parsedResult = llmResponse;
      }

      return parsedResult;
    } catch (e) {
      console.warn(`[scraper] Ошибка парсинга или анализа для ${url}:`, e);
      return [];
    }
  }

  let results: any[] = [];

  try {
    for (const targetUrl of validSites) {
      console.log(`\n--- Обработка: ${targetUrl} ---`);
      try {
        await delay(1000);
        await page.goto(targetUrl, {
          waitUntil: "domcontentloaded",
          timeout: 10000,
        });

        let links = [];

        if (
          !targetUrl.includes("/product/") &&
          !targetUrl.includes("/card/") &&
          !targetUrl.includes("/p/")
        ) {
          const productLinks = await page.evaluate(() => {
            const selectors = [
              'a[href*="/product/"]',
              'a[href*="/card/"]',
              'a[href*="/p/"]',
            ];

            const rawLinks = Array.from(
              document.querySelectorAll(selectors.join(",")),
            ).map((a) => (a as HTMLAnchorElement).href);

            const normalize = (url: string) => {
              try {
                const u = new URL(url);

                return u.origin + u.pathname;
              } catch {
                return url;
              }
            };

            const cleanLinks = rawLinks.map((link) => normalize(link));

            const unique = [...new Set(cleanLinks)]
              .filter((link) => {
                const l = link.toLowerCase();
                return (
                  !l.includes("/reviews") &&
                  !l.includes("/spec") &&
                  !l.includes("/otzyvy")
                );
              })
              .slice(0, 3);

            return unique;
          });

          console.log(
            "ссылки на товары:",
            productLinks.length,
            "сами товары",
            productLinks,
          );

          links.push(...productLinks);
        } else {
          links.push(targetUrl);
        }

        if (links.length > 0) {
          console.log(`Найдено товаров для перехода: ${links.length}`);

          for (const link of links) {
            console.log(`  -> Глубокий анализ: ${link}`);
            try {
              await page.goto(link, {
                waitUntil: "domcontentloaded",
                timeout: 10000,
              });

              const itemResults = await getAnalysis(link, page);

              if (itemResults.length > 0) {
                const enriched = itemResults.map((i: any) => ({
                  ...i,
                  url: link,
                }));
                results.push(...enriched);
              }
            } catch (err) {
              console.error(
                `  [!] Ошибка в карточке ${link}:`,
                (err as any).message,
              );
            }
          }
        } else {
          console.log(`Ссылки не найдены, анализирую текущую страницу...`);
          const pageResults = await getAnalysis(targetUrl, page);
          if (pageResults.length > 0) {
            results.push(
              ...pageResults.map((i: any) => ({ ...i, url: targetUrl })),
            );
          }
        }
      } catch (siteError: any) {
        console.error(`Ошибка при загрузке ${targetUrl}:`, siteError.message);
        continue;
      }
    }

    return results;
  } catch (error) {
    console.error("Критическая ошибка в checkSites:", error);
    return results;
  } finally {
    console.log(`\nscraper Завершено. Найдено товаров: ${results.length}`);
    await context.close();
    await browser.close();
  }
}
