import { ChatMessage, ChatState } from "./state"
import { MutationTree } from "vuex"

export enum ChatMutations {
  ADD_MESSAGE = "ADD_MESSAGE",
}

export interface Mutations<S = ChatState> {
  [ChatMutations.ADD_MESSAGE]: (state: S, payload: ChatMessage) => void
}

export const mutations: MutationTree<ChatState> & Mutations = {
  [ChatMutations.ADD_MESSAGE](state: ChatState, message: ChatMessage) {
    state.messages.push(message)
  },
}
