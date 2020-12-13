import { MutationTree } from "vuex"
import { User } from "@/models/user"
import { UserRehydrateEvent } from "@/models/events"
import { UserState } from "./state"

export enum UserMutations {
  REHYDRATE = "REHYDRATE",
  USER_JOINED = "PLAYER_JOINED",
  USER_LEFT = "PLAYER_LEFT",
}

export interface Mutations<S = UserState> {
  [UserMutations.REHYDRATE](state: S, rehydrate: UserRehydrateEvent): void
  [UserMutations.USER_JOINED](state: S, user: User): void
  [UserMutations.USER_LEFT](state: S, user: User): void
}

export const mutations: MutationTree<UserState> & Mutations = {
  [UserMutations.REHYDRATE](state: UserState, event: UserRehydrateEvent) {
    console.log(event)
    state.selfUser = event.selfUser
    for (const playerState of event.playerStates) {
      state.playerStates[playerState.user.id] = playerState
    }
  },
  [UserMutations.USER_JOINED](state: UserState, user: User) {
    if (user.id in state.playerStates) {
      state.playerStates[user.id].isConnected = true
    }
  },
  [UserMutations.USER_LEFT](state: UserState, user: User) {
    if (user.id in state.playerStates) {
      state.playerStates[user.id].isConnected = false
    }
  },
}
