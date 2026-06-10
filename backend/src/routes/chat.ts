import { Router, Request, Response } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import {
  addMessage,
  createChat,
  getChatById,
  getChatsByAuthor,
} from "../services/chat";
import { Chat } from "../db/models/chat";
import { callLLM } from "../internal/callLLM";
import { upload } from "../middlewares/multer";
import { readPDF } from "../internal/readPDF";
import { checkSites, search } from "../internal/scraper";
import { FORM_QUERY_SYSTEM_PROMPT } from "../internal/prompts";
import { User } from "../db/models/user";

const router = Router();

// router.get("/", requireAuth, async (req: Request, res: Response) => {
//   try {
//     const authorId = (req as any).auth.userId;

//     const chat = await getChatsByAuthor(authorId);
//     if (!chat || chat.length === 0) {
//       const newChat = await createChat(authorId);
//       return res.json([newChat]);
//     }

//     return res.json(chat);
//   } catch (error: any) {
//     return res.status(500).json({ error: error.message });
//   }
// });

router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID чата не предоставлен" });
    }

    const chat = await getChatById(id);
    if (!chat) {
      return res.status(404).json({ error: "Чат не найден" });
    }

    const currentUserId = (req as any).auth.userId;
    if (chat.author.toString() !== currentUserId) {
      return res.status(403).json({
        error: "Доступ запрещен: вы не являетесь автором этого чата",
      });
    }

    return res.status(200).json(chat);
  } catch (error: any) {
    console.error("Get chat by id error:", error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const authorId = (req as any).auth.userId;
    const newChat = await createChat(authorId);
    return res.status(201).json(newChat);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post(
  "/formSearchQuery",
  requireAuth,
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const { chatId, text } = req.body;
      const file = req.file;
      const currentUserId = (req as any).auth.userId;

      let userText = text || "";

      if (!chatId || (!text && !file)) {
        return res
          .status(400)
          .json({ error: "chatId and (text or file) are required" });
      }

      const [chat, user] = await Promise.all([
        Chat.findById(chatId),
        User.findById(currentUserId),
      ]);
      if (!chat) return res.status(404).json({ error: "Чат не найден" });
      if (!user)
        return res.status(404).json({ error: "Пользователь не найден" });
      if (chat.author.toString() !== currentUserId) {
        return res.status(403).json({ error: "Доступ запрещен" });
      }

      // console.log("DEBUG SETTINGS:", user?.settings);

      if (file) {
        const pdfText = await readPDF(file.path);
        userText += pdfText;
      }

      await addMessage(chatId, "firstMessage", userText);

      console.log("usertext", userText);

      const aiResponse = await callLLM(
        FORM_QUERY_SYSTEM_PROMPT,
        userText,
        user?.settings,
      );
      const aiMessage = await addMessage(
        chatId,
        "formattedURL",
        aiResponse as string,
      );

      console.log("debug airesp", aiResponse);

      return res.status(200).json(aiMessage);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  },
);

router.post(
  "/startScraping",
  requireAuth,
  async (req: Request, res: Response) => {
    const { chatId, text } = req.body;
    const currentUserId = (req as any).auth.userId;

    if (!chatId || !text) {
      return res
        .status(400)
        .json({ error: "chatId and (text or file) are required" });
    }

    console.log("text", text);

    const [chat, user] = await Promise.all([
      Chat.findById(chatId),
      User.findById(currentUserId),
    ]);
    if (!chat) return res.status(404).json({ error: "Чат не найден" });
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });
    if (chat.author.toString() !== currentUserId) {
      return res.status(403).json({ error: "Доступ запрещен" });
    }

    // console.log("DEBUG SETTINGS:", user?.settings);

    const sitesURL = await search(text);
    console.log("[debug] sitesURL", sitesURL);
    // const rangeURLS = await callLLM(
    //   RANGE_SYSTEM_PROMPT,
    //   sitesURL,
    //   user.settings,
    // );
    // console.log("[debug] rangeURLS", rangeURLS);
    const checkedSites = await checkSites(text, sitesURL, user.settings);
    const summaryText =
      checkedSites.length > 0
        ? `Я проанализировал сайты и нашел следующие подходящие варианты:`
        : `К сожалению, по вашему запросу ничего не удалось найти.`;

    const finalChatState = await addMessage(
      chatId,
      "result",
      summaryText + "\n" + JSON.stringify(checkedSites),
    );

    console.log("\n\nfinal final fantazy", checkedSites);

    return res.status(200).json(finalChatState);
  },
);

export { router as chatRouter };
