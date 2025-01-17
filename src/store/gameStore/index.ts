import { Actions, actions } from "./actions"
import { GameState, state } from "./state"
import { Getters, getters } from "./getters"
import { Mutations, mutations } from "./mutations"
import { Store as VuexStore, createStore, useStore } from "vuex"
import { InjectionKey } from "vue"
import { Store } from "../types"

export const gameStoreKey: InjectionKey<VuexStore<GameState>> = Symbol()

export const gameStateStore = createStore<GameState>({
  state,
  getters,
  mutations,
  actions,
})

export type GameStore = Store<GameState, Mutations, Actions, Getters>

export function useGameStore(): GameStore {
  return useStore(gameStoreKey)
}
