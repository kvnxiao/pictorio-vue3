import { ChatEvent, RehydrateEvent } from "@/models/events"
import { ChatState } from "./state"
import { MutationTree } from "vuex"

export enum ChatMutations {
  RESET = "RESET",
  REHYDRATE = "REHYDRATE",
  ADD_MESSAGE = "ADD_MESSAGE",
}

export interface Mutations<S = ChatState> {
  [ChatMutations.RESET](state: S): void
  [ChatMutations.REHYDRATE](state: S, payload: RehydrateEvent): void
  [ChatMutations.ADD_MESSAGE](state: S, payload: ChatEvent): void
}

export const mutations: MutationTree<ChatState> & Mutations = {
  [ChatMutations.RESET](state: ChatState) {
    state.messages.splice(0, state.messages.length)
  },
  [ChatMutations.REHYDRATE](state: ChatState, event: RehydrateEvent) {
    const messages = event.chatMessages
    state.messages = [...messages]
  },
  [ChatMutations.ADD_MESSAGE](state: ChatState, message: ChatEvent) {
    state.messages.push(message)
  },
}
