import { beforeAll, afterAll, beforeEach } from "vitest";
import mongoose from "mongoose";

beforeAll(async () => {
  const dbUri = "mongodb://admin:admin@localhost:27017/AIchat?authSource=admin";

  if (!dbUri) {
    throw new Error("DB_URI is not defined in environment variables!");
  }

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(dbUri);
  }
});

beforeEach(async () => {
  if (mongoose.connection.readyState !== 1) {
    await new Promise((resolve) =>
      mongoose.connection.once("connected", resolve),
    );
  }

  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});
