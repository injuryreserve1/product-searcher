import mongoose, { Schema, Types } from "mongoose";

export type Stage = "firstMessage" | "formattedURL" | "result";

export interface IMessage {
  stage: Stage;
  text: string;
  createdAt?: Date;
}

export interface IChat extends Document {
  title: string;
  author: Types.ObjectId;
  messages: IMessage[];
  createdAt: Date;
}

const chatSchema = new Schema<IChat>({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  messages: [
    {
      stage: {
        type: String,
        enum: ["firstMessage", "formattedURL"],
        required: true,
      },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export const Chat = mongoose.model("Chat", chatSchema);
