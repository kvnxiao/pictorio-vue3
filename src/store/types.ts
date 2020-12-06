import { CommitOptions, DispatchOptions, Store as VuexStore } from "vuex"

type IndexableTypeMapping = { [key: string]: any }

export type Store<
  S extends object,
  Mutations extends IndexableTypeMapping,
  Actions extends IndexableTypeMapping,
  Getters extends IndexableTypeMapping
> = Omit<VuexStore<S>, "getters" | "commit" | "dispatch"> & {
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
