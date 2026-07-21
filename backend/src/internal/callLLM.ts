import OpenAI from "openai";

interface LLMOptions {
  baseUrl?: string;
  modelName?: string;
  apiKey?: string;
}

export async function callLLM(
  sysPrompt: string,
  rawText: string | string[],
  options?: LLMOptions,
) {
  const userContent = Array.isArray(rawText) ? rawText.join("\n") : rawText;

  const openai = new OpenAI({
    apiKey: options?.apiKey || process.env.OPENROUTER_API_KEY,
    baseURL: options?.baseUrl || "https://openrouter.ai/api/v1",
  });

  try {
    const response = await openai.chat.completions.create({
      model: options?.modelName || "gpt-3.5-turbo",
      messages: [
        { role: "system", content: sysPrompt },
        { role: "user", content: `Текст пользователя: "${userContent}"` },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message?.content || "";
  } catch (error: any) {
    console.error("Ошибка при работе с LLM через OpenAI SDK:", error.message);
    throw new Error(error.message || "Ошибка связи с LLM");
    // return "[]";
  }
}
