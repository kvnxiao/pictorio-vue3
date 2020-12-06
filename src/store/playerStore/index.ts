import { Actions, actions } from "./actions"
import { Getters, getters } from "./getters"
import { Mutations, mutations } from "./mutations"
import { PlayerState, state } from "./state"
import { Store as VuexStore, createStore, useStore } from "vuex"
import { InjectionKey } from "vue"
import { Store } from "../types"

export const playerStoreKey: InjectionKey<VuexStore<PlayerState>> = Symbol()

export const playerStore = createStore<PlayerState>({
  state,
  getters,
  mutations,
  actions,
})

export function usePlayerStore(): Store<PlayerState, Mutations, Actions, Getters> {
  return useStore(playerStoreKey)
}
