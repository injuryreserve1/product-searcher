import mongoose from "mongoose";
import config from "../config/config";

export async function initDatabase() {
  const DATABASE_URL = config.db_uri;
  mongoose.connection.on("open", () => {
    console.info("succesfully connected to database:", DATABASE_URL);
  });
  const connection = mongoose.connect(DATABASE_URL);
  return connection;
}
