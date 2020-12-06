import { GetterTree } from "vuex"
import { PlayerState } from "./state"

/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
export interface Getters<S = PlayerState> {}

export const getters: GetterTree<PlayerState, PlayerState> & Getters = {}
