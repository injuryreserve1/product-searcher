import { Chat, type Stage } from "../db/models/chat";

async function getChats(query = {}) {
  return await Chat.find(query).populate("author", "username").exec();
}

export async function getChatById(id: any) {
  return await Chat.findById(id);
}

export async function createChat(authorId: string, options: any = {}) {
  const newChat = new Chat({
    title: "Новый диалог",
    author: authorId,
    messages: [],
  });
  await newChat.save();
  return await newChat.populate("author", "username");
}

export async function addMessage(chatId: string, stage: Stage, text: string) {
  const updatedChat = await Chat.findOneAndUpdate(
    {
      _id: chatId,
      "messages.stage": stage,
    },
    {
      $set: {
        "messages.$.text": text,
        "messages.$.createdAt": new Date(),
      },
    },
    { new: true },
  );

  if (!updatedChat) {
    return await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: {
          messages: { stage, text, createdAt: new Date() },
        },
      },
      { new: true },
    );
  }

  return updatedChat;
}

export async function getChatsByAuthor(authorId: string) {
  return await getChats({ author: authorId });
}
