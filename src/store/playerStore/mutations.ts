import { MutationTree } from "vuex"
import { Player } from "@/models/player"
import { PlayerState } from "./state"

export enum PlayerMutations {
  SET_SELF_PLAYER = "SET_SELF_PLAYER",
}

export interface Mutations<S = PlayerState> {
  [PlayerMutations.SET_SELF_PLAYER](state: S, player: Player): void
}

export const mutations: MutationTree<PlayerState> & Mutations = {
  [PlayerMutations.SET_SELF_PLAYER](state: PlayerState, player: Player) {
    state.selfPlayer = player
  },
}
