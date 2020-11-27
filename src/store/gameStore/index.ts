import { Actions, actions } from "./actions"
import {
  CommitOptions,
  DispatchOptions,
  Store as VuexStore,
  createStore,
  useStore,
} from "vuex"
import { GameState, state } from "./state"
import { Getters, getters } from "./getters"
import { Mutations, mutations } from "./mutations"
import { InjectionKey } from "vue"

export const key: InjectionKey<VuexStore<GameState>> = Symbol()

export const gameStateStore = createStore<GameState>({
  state,
  getters,
  mutations,
  actions,
})

export type Store<GameState> = Omit<
  VuexStore<GameState>,
  "getters" | "commit" | "dispatch"
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload?: P,
    options?: CommitOptions,
  ): ReturnType<Mutations[K]>
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions,
  ): ReturnType<Actions[K]>
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>
  }
}

export function useGameState(): Store<GameState> {
  return useStore(key)
}
