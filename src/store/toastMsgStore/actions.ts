import { ActionTree } from "vuex"
import { ToastMessageState } from "./state"

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface Actions {}

export const actions: ActionTree<ToastMessageState, ToastMessageState> & Actions = {}
