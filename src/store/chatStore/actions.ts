import { ActionTree } from "vuex"
import { ChatState } from "./state"

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface Actions {}

export const actions: ActionTree<ChatState, ChatState> & Actions = {}
