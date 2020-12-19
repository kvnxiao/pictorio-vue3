import { MutationTree } from "vuex"
import { ToastMessage } from "@/models/toastMessage"
import { ToastMessageState } from "./state"

export enum ToastMessageMutations {
  SET = "SET",
  CLEAR = "CLEAR",
}

export interface Mutations<S = ToastMessageState> {
  [ToastMessageMutations.SET](state: S, payload: ToastMessage): void
  [ToastMessageMutations.CLEAR](state: S): void
}

export const mutations: MutationTree<ToastMessageState> & Mutations = {
  [ToastMessageMutations.SET](state: ToastMessageState, event: ToastMessage) {
    state.message = event
  },
  [ToastMessageMutations.CLEAR](state: ToastMessageState) {
    state.message = null
  },
}
