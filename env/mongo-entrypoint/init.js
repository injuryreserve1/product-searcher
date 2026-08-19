db = db.getSiblingDB("AIchat");

db.users.updateOne(
  { username: "765" },
  {
    $setOnInsert: {
      username: "765",
      password: process.env.MONGO_INITDB_ROOT_PASSWORD_HASH,
      settings: {
        baseUrl: "https://api.proxy.com/v1",
        modelName: "gpt-4",
        apiKey: "your api key",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  { upsert: true },
);
