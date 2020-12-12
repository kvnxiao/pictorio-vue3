import { User } from "@/models/user"

export enum MessageType {
  Text,
  SystemText,
  UserJoin,
  UserLeave,
}

export interface ChatMessage {
  user?: User
  message: string
  isSystem: boolean
  type: MessageType
}

export interface ChatState {
  messages: ChatMessage[]
}

export const state: ChatState = {
  messages: [],
}
