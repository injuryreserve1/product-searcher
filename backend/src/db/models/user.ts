import mongoose, { Schema, Types } from "mongoose";

export interface Settings {
  baseUrl: string;
  modelName: string;
  apiKey: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  username: string;
  password: string;
  refreshToken?: string;
  refreshTokenExpires?: Date;
  settings?: Settings;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    settings: {
      baseUrl: { type: String, default: "https://api.proxy.com/v1" },
      modelName: { type: String, default: "gpt-4" },
      apiKey: { type: String, default: "your api key" },
    },
  },
  {
    timestamps: true,
    bufferCommands: false,
  },
);

export const User = mongoose.model("User", userSchema);
