db = db.getSiblingDB("AIchat");

db.users.updateOne(
  { username: "765" },
  {
    $setOnInsert: {
      username: "765",
      password: "$2b$10$k02VImFPYkWNyaptugONt.1uiNjcWfdGtu9E7tNCL42Om7todHPd.",
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
