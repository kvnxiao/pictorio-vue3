import { PlayerState, Status } from "./state"
import { MutationTree } from "vuex"
import { Player } from "@/models/player"

export enum PlayerMutations {
  SET_SELF_PLAYER = "SET_SELF_PLAYER",
  PLAYER_JOINED = "PLAYER_JOINED",
  PLAYER_LEFT = "PLAYER_LEFT",
}

export interface Mutations<S = PlayerState> {
  [PlayerMutations.SET_SELF_PLAYER](state: S, player: Player): void
  [PlayerMutations.PLAYER_JOINED](state: S, player: Player): void
  [PlayerMutations.PLAYER_LEFT](state: S, player: Player): void
}

export const mutations: MutationTree<PlayerState> & Mutations = {
  [PlayerMutations.SET_SELF_PLAYER](state: PlayerState, player: Player) {
    state.selfPlayer = player
  },
  [PlayerMutations.PLAYER_JOINED](state: PlayerState, player: Player) {
    state.playerIds[player.id] = { player, status: Status.JOINED }
  },
  [PlayerMutations.PLAYER_LEFT](state: PlayerState, player: Player) {
    state.playerIds[player.id] = { player, status: Status.LEFT }
  },
}
