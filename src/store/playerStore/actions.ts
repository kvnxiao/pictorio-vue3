import { ActionTree } from "vuex"
import { PlayerState } from "./state"

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface Actions {}

export const actions: ActionTree<PlayerState, PlayerState> & Actions = {}
