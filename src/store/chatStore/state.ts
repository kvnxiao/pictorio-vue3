import { Player } from "@/models/player"

export enum MessageType {
  PlayerText,
  SystemText,
  PlayerJoin,
  PlayerLeave,
}

export interface ChatMessage {
  player?: Player
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
