import { ChatEvent, ChatRehydrateEvent } from "@/models/events"
import { ChatState } from "./state"
import { MutationTree } from "vuex"

export enum ChatMutations {
  REHYDRATE = "REHYDRATE",
  ADD_MESSAGE = "ADD_MESSAGE",
}

export interface Mutations<S = ChatState> {
  [ChatMutations.REHYDRATE]: (state: S, payload: ChatRehydrateEvent) => void
  [ChatMutations.ADD_MESSAGE]: (state: S, payload: ChatEvent) => void
}

export const mutations: MutationTree<ChatState> & Mutations = {
  [ChatMutations.REHYDRATE](state: ChatState, event: ChatRehydrateEvent) {
    const messages = event.chatMessages
    state.messages = [...messages]
  },
  [ChatMutations.ADD_MESSAGE](state: ChatState, message: ChatEvent) {
    state.messages.push(message)
  },
}
