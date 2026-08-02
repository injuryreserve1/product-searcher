import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user";
import { chatRouter } from "./routes/chat";
import cookieParser from "cookie-parser";
import { healthRouter } from "./routes/health";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/health", healthRouter);

export { app };
