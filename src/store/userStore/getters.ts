import { GetterTree } from "vuex"
import { UserState } from "./state"

/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
export interface Getters<S = UserState> {}

export const getters: GetterTree<UserState, UserState> & Getters = {}
