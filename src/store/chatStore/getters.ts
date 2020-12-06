import { ChatState } from "./state"
import { GetterTree } from "vuex"

/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
export interface Getters<S = ChatState> {}

export const getters: GetterTree<ChatState, ChatState> & Getters = {}
