import { ActionTree } from "vuex"
import { GameState } from "./state"

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface Actions {}

export const actions: ActionTree<GameState, GameState> & Actions = {}
