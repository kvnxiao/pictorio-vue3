import { Actions, actions } from "./actions"
import {
  CommitOptions,
  DispatchOptions,
  Store as VuexStore,
  createStore,
  useStore,
} from "vuex"
import { Getters, getters } from "./getters"
import { Mutations, mutations } from "./mutations"
import { PlayerState, state } from "./state"
import { InjectionKey } from "vue"

export const playerStoreKey: InjectionKey<VuexStore<PlayerState>> = Symbol()

export const playerStore = createStore<PlayerState>({
  state,
  getters,
  mutations,
  actions,
})

export type Store<PlayerState> = Omit<
  VuexStore<PlayerState>,
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

export function usePlayerStore(): Store<PlayerState> {
  return useStore(playerStoreKey)
}
