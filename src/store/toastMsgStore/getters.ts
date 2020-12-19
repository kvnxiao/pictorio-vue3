import { GetterTree } from "vuex"
import { ToastMessageState } from "./state"

/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
export interface Getters<S = ToastMessageState> {}

export const getters: GetterTree<ToastMessageState, ToastMessageState> & Getters = {}
