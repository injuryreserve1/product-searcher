export const args = [
  "--disable-blink-features=AutomationControlled",
  "--disable-web-security",
  "--no-sandbox",
  `--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36`,
];

export const headers = {
  "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
  "Accept-Encoding": "gzip, deflate, br",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
};
