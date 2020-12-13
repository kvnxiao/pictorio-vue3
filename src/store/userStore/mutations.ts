import { ReadyEvent, UserRehydrateEvent } from "@/models/events"
import { MutationTree } from "vuex"
import { User } from "@/models/user"
import { UserState } from "./state"

export enum UserMutations {
  REHYDRATE = "REHYDRATE",
  USER_JOINED = "USER_JOINED",
  USER_LEFT = "USER_LEFT",
  USER_READY = "USER_READY",
}

export interface Mutations<S = UserState> {
  [UserMutations.REHYDRATE](state: S, event: UserRehydrateEvent): void
  [UserMutations.USER_JOINED](state: S, user: User): void
  [UserMutations.USER_LEFT](state: S, user: User): void
  [UserMutations.USER_READY](state: S, event: ReadyEvent): void
}

export const mutations: MutationTree<UserState> & Mutations = {
  [UserMutations.REHYDRATE](state: UserState, event: UserRehydrateEvent) {
    state.selfUser = event.selfUser
    for (const playerState of event.playerStates) {
      state.playerStates[playerState.user.id] = playerState
    }
  },
  [UserMutations.USER_JOINED](state: UserState, user: User) {
    if (user.id in state.playerStates) {
      state.playerStates[user.id].isConnected = true
      state.playerStates[user.id].isReady = false
    }
  },
  [UserMutations.USER_LEFT](state: UserState, user: User) {
    if (user.id in state.playerStates) {
      state.playerStates[user.id].isConnected = false
      state.playerStates[user.id].isReady = false
    }
  },
  [UserMutations.USER_READY](state: UserState, event: ReadyEvent) {
    if (event.user.id in state.playerStates) {
      state.playerStates[event.user.id].isReady = event.ready
    }
  },
}
