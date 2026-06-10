import { app } from "./app";
import config from "./config/config";
import { initDatabase } from "./db/init";

async function start() {
  try {
    await initDatabase();
    app.listen(config.port, () => {
      console.log(`server based on websocket is running on ${config.port}`);
    });
  } catch (error) {
    console.error("error while connecting to db or running server", error);
  }
}

start();
