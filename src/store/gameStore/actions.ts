import { GameMutations, Mutations } from "./mutations"
import type { ActionContext } from "../types"
import { ActionTree } from "vuex"
import { GameState } from "./state"

export enum GameActions {
  CLEAR_DRAWING = "CLEAR_DRAWING",
  UNDO = "UNDO",
  REDO = "REDO",
}

type Context = ActionContext<GameState, Mutations>

export interface Actions {
  [GameActions.CLEAR_DRAWING]: (context: Context) => Promise<void>
  [GameActions.UNDO]: (context: Context) => Promise<void>
  [GameActions.REDO]: (context: Context) => Promise<void>
}

export const actions: ActionTree<GameState, GameState> & Actions = {
  [GameActions.CLEAR_DRAWING]: async ({ commit }): Promise<void> => {
    commit(GameMutations.CLEAR_DRAWING)
  },
  [GameActions.UNDO]: async ({ commit }): Promise<void> => {
    commit(GameMutations.UNDO)
  },
  [GameActions.REDO]: async ({ commit }): Promise<void> => {
    commit(GameMutations.REDO)
  },
}
