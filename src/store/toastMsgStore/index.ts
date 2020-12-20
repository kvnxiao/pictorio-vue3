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

export function useToastMsgStore(): Store<
  ToastMessageState,
  Mutations,
  Actions,
  Getters
> {
  return useStore(toastMsgStoreKey)
}