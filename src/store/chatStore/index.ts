import { Actions, actions } from "./actions"
import { ChatState, state } from "./state"
import { Getters, getters } from "./getters"
import { Mutations, mutations } from "./mutations"
import { Store as VuexStore, createStore, useStore } from "vuex"
import { InjectionKey } from "vue"
import { Store } from "../types"

export const chatStoreKey: InjectionKey<VuexStore<ChatState>> = Symbol()

export const chatStore = createStore<ChatState>({
  state,
  getters,
  mutations,
  actions,
})

export type ChatStore = Store<ChatState, Mutations, Actions, Getters>

export function useChatStore(): ChatStore {
  return useStore(chatStoreKey)
}
