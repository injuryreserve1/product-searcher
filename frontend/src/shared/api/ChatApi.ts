import type { Chat } from "@/entities/ChatHistoryItem";

export class ChatApi {
  private _baseUrl: string;

  constructor(url: string) {
    this._baseUrl = url;
  }

  private handleResponse = async <T>(res: Response): Promise<T> => {
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Ошибка сервера: ${res.status}`);
    }
    return res.json();
  };

  async getChats(): Promise<Chat[]> {
    const res = await fetch(`${this._baseUrl}/`, {
      method: "GET",
      credentials: "include",
    });
    return this.handleResponse<Chat[]>(res);
  }

  async getChatById(id: string): Promise<Chat> {
    console.log(id, "id");
    const res = await fetch(`${this._baseUrl}/${id}`, {
      method: "GET",
      credentials: "include",
    });
    return this.handleResponse<Chat>(res);
  }

  async createChat() {
    try {
      const response = await fetch(`${this._baseUrl}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("FAILED TO CREATE NEW CHAT");
      }
      const newChat = await response.json();
      return newChat;
    } catch (e) {
      console.error("Ошибка при создании чата", e);
    }
  }

  async postMessage(chatId: string, text?: string, file?: File) {
    const formData = new FormData();

    formData.append("chatId", chatId);

    if (text) formData.append("text", text);
    if (file) formData.append("file", file);

    const response = await fetch(`${this._baseUrl}/formSearchQuery`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to send message");
    }

    return response.json();
  }

  async startScraping(chatId: string, text: string) {
    const response = await fetch(`${this._baseUrl}/startScraping`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        chatId,
        text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Ошибка при скрапинге");
    }

    return await response.json();
  }
}

export const chatApi = new ChatApi(
  `${import.meta.env.VITE_BACKEND_URL}api/v1/chat`,
);
