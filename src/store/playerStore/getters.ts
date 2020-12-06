import { PlayerState } from "./state"
import { GetterTree } from "vuex"

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface Getters<S = PlayerState> {}

export const getters: GetterTree<PlayerState, PlayerState> & Getters = {}
