import { Actions, actions } from "./actions"
import { Getters, getters } from "./getters"
import { Mutations, mutations } from "./mutations"
import { ToastMessageState, state } from "./state"
import { Store as VuexStore, createStore, useStore } from "vuex"
import { InjectionKey } from "vue"
import { Store } from "../types"

export const toastMsgStoreKey: InjectionKey<VuexStore<ToastMessageState>> = Symbol()

export const toastMsgStore = createStore<ToastMessageState>({
  state,
  getters,
  mutations,
  actions,
})

export type ToastMessageStore = Store<ToastMessageState, Mutations, Actions, Getters>

export function useToastMsgStore(): ToastMessageStore {
  return useStore(toastMsgStoreKey)
}
