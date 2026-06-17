import { Message } from './MessageBubble';

export interface Chat {
  id: string;
  name: string;
  handle: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}
