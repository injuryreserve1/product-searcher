import type { IMessage } from "@/entities/Message";

export interface IChat {
  _id: string;
  author: string;
  messages: IMessage[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
