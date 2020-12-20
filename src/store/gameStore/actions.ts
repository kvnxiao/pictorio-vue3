import { DrawEventType, EventType, GameEventTypeMap } from "@/models/events"
import { GameMutations, Mutations } from "./mutations"
import type { ActionContext } from "../types"
import { ActionTree } from "vuex"
import { GameState } from "./state"
import { Line } from "@/models/drawing"
import { User } from "@/models/user"

export enum GameActions {
  ADD_LINE = "ADD_LINE",
  CLEAR_DRAWING = "CLEAR_DRAWING",
  UNDO = "UNDO",
  REDO = "REDO",
}

export interface DrawingPayload {
  user: User
  sendEvent(eventType: EventType, eventData: GameEventTypeMap[EventType]): void
}

export interface AddLinePayload extends DrawingPayload {
  line: Line
}

export interface Actions<C = ActionContext<GameState, Mutations>> {
  [GameActions.ADD_LINE]: (context: C, payload: AddLinePayload) => Promise<Line>
  [GameActions.CLEAR_DRAWING]: (context: C, payload: DrawingPayload) => Promise<void>
  [GameActions.UNDO]: (context: C, payload: DrawingPayload) => Promise<void>
  [GameActions.REDO]: (context: C, payload: DrawingPayload) => Promise<void>
}

export const actions: ActionTree<GameState, GameState> & Actions = {
  [GameActions.ADD_LINE]: async (
    { commit },
    payload: AddLinePayload,
  ): Promise<Line> => {
    const { line, sendEvent, user } = payload
    commit(GameMutations.ADD_LINE, line)
    sendEvent(EventType.DrawEvent, {
      user,
      line,
      type: DrawEventType.LINE,
    })
    return line
  },
  [GameActions.CLEAR_DRAWING]: async (
    { commit },
    payload: DrawingPayload,
  ): Promise<void> => {
    const { sendEvent, user } = payload
    commit(GameMutations.CLEAR_DRAWING)
    sendEvent(EventType.DrawEvent, {
      user,
      type: DrawEventType.CLEAR,
    })
  },
  [GameActions.UNDO]: async ({ commit }, payload: DrawingPayload): Promise<void> => {
    const { sendEvent, user } = payload
    commit(GameMutations.UNDO)
    sendEvent(EventType.DrawEvent, {
      user,
      type: DrawEventType.UNDO,
    })
  },
  [GameActions.REDO]: async ({ commit }, payload: DrawingPayload): Promise<void> => {
    const { sendEvent, user } = payload
    commit(GameMutations.REDO)
    sendEvent(EventType.DrawEvent, {
      user,
      type: DrawEventType.REDO,
    })
  },
}
