import { ReadyEvent, UserRehydrateEvent } from "@/models/events"
import { MutationTree } from "vuex"
import { PlayerState } from "@/models/playerState"
import { UserState } from "./state"

export enum UserMutations {
  REHYDRATE = "REHYDRATE",
  USER_JOINED = "USER_JOINED",
  USER_LEFT = "USER_LEFT",
  USER_READY = "USER_READY",
}

export interface Mutations<S = UserState> {
  [UserMutations.REHYDRATE](state: S, event: UserRehydrateEvent): void
  [UserMutations.USER_JOINED](state: S, player: PlayerState): void
  [UserMutations.USER_LEFT](state: S, player: PlayerState): void
  [UserMutations.USER_READY](state: S, event: ReadyEvent): void
}

export const mutations: MutationTree<UserState> & Mutations = {
  [UserMutations.REHYDRATE](state: UserState, event: UserRehydrateEvent) {
    state.selfUser = event.selfUser
    for (const playerState of event.playerStates) {
      state.playerStates[playerState.user.id] = playerState
    }
  },
  [UserMutations.USER_JOINED](state: UserState, player: PlayerState) {
    if (player.user.id in state.playerStates) {
      state.playerStates[player.user.id].isConnected = true
      state.playerStates[player.user.id].isReady = false
    } else {
      // New user joined
      state.playerStates[player.user.id] = player
    }
  },
  [UserMutations.USER_LEFT](state: UserState, player: PlayerState) {
    if (player.user.id in state.playerStates) {
      state.playerStates[player.user.id].isConnected = false
      state.playerStates[player.user.id].isReady = false
    }
  },
  [UserMutations.USER_READY](state: UserState, event: ReadyEvent) {
    if (event.user.id in state.playerStates) {
      state.playerStates[event.user.id].isReady = event.ready
    }
  },
}
