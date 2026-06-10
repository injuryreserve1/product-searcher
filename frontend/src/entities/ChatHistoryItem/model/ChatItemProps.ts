export interface ChatItemProps {
  id: string;
  title: string;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export interface Message {
  stage: string;
  text: string;
  createdAt: string;
  _id: string;
}

export interface Chat {
  _id: string;
  title: string;
  author: string;
  messages: Message[];
  createdAt: string;
}
