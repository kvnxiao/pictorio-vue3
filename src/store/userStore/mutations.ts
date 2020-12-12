import { Status, UserState } from "./state"
import { MutationTree } from "vuex"
import { User } from "@/models/user"

export enum UserMutations {
  SET_SELF_USER = "SET_SELF_PLAYER",
  USER_JOINED = "PLAYER_JOINED",
  USER_LEFT = "PLAYER_LEFT",
}

export interface Mutations<S = UserState> {
  [UserMutations.SET_SELF_USER](state: S, user: User): void
  [UserMutations.USER_JOINED](state: S, user: User): void
  [UserMutations.USER_LEFT](state: S, user: User): void
}

export const mutations: MutationTree<UserState> & Mutations = {
  [UserMutations.SET_SELF_USER](state: UserState, user: User) {
    state.selfUser = user
  },
  [UserMutations.USER_JOINED](state: UserState, user: User) {
    state.userIds[user.id] = { user, status: Status.JOINED }
  },
  [UserMutations.USER_LEFT](state: UserState, user: User) {
    state.userIds[user.id] = { user, status: Status.LEFT }
  },
}
