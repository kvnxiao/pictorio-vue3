import { ChatEvent } from "@/models/events"

export interface ChatState {
  messages: ChatEvent[]
}

export const state: ChatState = {
  messages: [],
}
