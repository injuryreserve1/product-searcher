import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createUser, getUser, loginUser, updateUser } from "../services/user";
import config from "../config/config";
import { createChat, getChatsByAuthor } from "../services/chat";
import { Chat } from "../db/models/chat";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

const cookieAge = 400 * 24 * 60 * 60 * 1000;

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);

    const token = jwt.sign({ userId: user._id }, config.jwt_access);
    res.cookie("authcookie", token, {
      maxAge: cookieAge,
      httpOnly: true,
    });

    return res.status(201).json({ message: "Вы успешно зарегистрировались!" });
  } catch (error) {
    return res.status(400).json({
      error: "Ошибка при создании пользователя, возможно он уже существует",
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await loginUser({ username, password });

    const token = jwt.sign({ userId: user._id }, config.jwt_access);
    res.cookie("authcookie", token, { maxAge: cookieAge, httpOnly: true });

    let chat = await Chat.findOne({ author: user._id }).sort({ createdAt: -1 });
    if (!chat) {
      chat = await createChat(user._id.toString());
    }

    return res.status(200).json({
      message: "Успешный вход",
      user: {
        id: user._id,
        username: user.username,
      },
      activeChatId: chat._id,
    });
  } catch (err: any) {
    return res.status(401).json({
      error: err.message,
    });
  }
});

// router.post("/login", async (req: Request, res: Response) => {
//   try {
//     const { username, password } = req.body;
//     const user = await loginUser({ username, password });

//     const accessToken = jwt.sign({ userId: user._id }, config.jwt_access, {
//       expiresIn: ACCESS_TOKEN_AGE / 1000,
//     });
//     const refreshToken = jwt.sign({ userId: user._id }, config.jwt_refresh, {
//       expiresIn: REFRESH_TOKEN_AGE / 1000,
//     });

//     res.cookie("accessToken", accessToken, {
//       maxAge: ACCESS_TOKEN_AGE,
//       httpOnly: true,
//       sameSite: "strict",
//     });

//     res.cookie("refreshToken", refreshToken, {
//       maxAge: REFRESH_TOKEN_AGE,
//       httpOnly: true,
//       sameSite: "strict",
//     });

//     let chat = await Chat.findOne({ author: user._id }).sort({ createdAt: -1 });
//     if (!chat) chat = await createChat(user._id.toString());

//     return res.status(200).json({
//       message: "Успешный вход",
//       user: { id: user._id, username: user.username },
//       activeChatId: chat._id,
//     });
//   } catch (err: any) {
//     return res.status(401).json({ error: err.message });
//   }
// });

router.post("/logout", async (_, res: Response) => {
  res.clearCookie("authcookie");

  return res.status(200).json({ message: "Вы успешно вышли" });
});

router.get("/info", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).auth.userId;
    // console.log("userId", userId);
    if (!userId) return res.status(401).json({ message: "Не авторизованы" });

    const user = await getUser(userId);
    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Error in /info:", error.message);

    const statusCode = error.message === "Пользователь не найден" ? 404 : 500;
    return res
      .status(statusCode)
      .json({ message: error.message || "Ошибка сервера" });
  }
});

router.patch(
  "/info-change",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).auth.userId;
      console.log("userID PATCH", userId);

      if (!userId) return res.status(401).json({ message: "Не авторизованы" });

      const { settings } = req.body;
      const dataToUpdate = settings.settings || settings;
      console.log("userID settings", settings);

      if (!dataToUpdate)
        return res.status(400).json({ message: "Данные настроек не переданы" });

      const updatedUser = await updateUser(userId, dataToUpdate);

      if (!updatedUser)
        return res.status(404).json({ message: "Пользователь не найден" });

      return res.status(200).json(updatedUser);
    } catch (error: any) {
      console.error("Error updating settings:", error.message);
      return res
        .status(500)
        .json({ message: "Ошибка при сохранении настроек" });
    }
  },
);

export { router as userRouter };
