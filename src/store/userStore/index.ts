import { Actions, actions } from "./actions"
import { Getters, getters } from "./getters"
import { Mutations, mutations } from "./mutations"
import { UserState, state } from "./state"
import { Store as VuexStore, createStore, useStore } from "vuex"
import { InjectionKey } from "vue"
import { Store } from "../types"

export const userStoreKey: InjectionKey<VuexStore<UserState>> = Symbol()

export const userStore = createStore<UserState>({
  state,
  getters,
  mutations,
  actions,
})

export function useUserStore(): Store<UserState, Mutations, Actions, Getters> {
  return useStore(userStoreKey)
}