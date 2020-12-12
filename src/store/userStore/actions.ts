import { ActionTree } from "vuex"
import { UserState } from "./state"

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface Actions {}

export const actions: ActionTree<UserState, UserState> & Actions = {}
