import { DrawEventType, EventType, GameEventTypeMap } from "@/models/events"
import { GameMutations, Mutations } from "./mutations"
import { Line, Point } from "@/models/drawing"
import type { ActionContext } from "../types"
import { ActionTree } from "vuex"
import { GameState } from "./state"
import { User } from "@/models/user"

export enum GameActions {
  CLEAR_DRAWING = "CLEAR_DRAWING",
  UNDO = "UNDO",
  REDO = "REDO",
  START_DRAW_POINT = "START_DRAW_POINT",
  STOP_DRAW_POINT = "STOP_DRAW_POINT",
}

export interface DrawingPayload {
  user: User
  sendEvent(eventType: EventType, eventData: GameEventTypeMap[EventType]): void
}

export interface StopDrawingPayload extends DrawingPayload {
  point: Point
}

export interface Actions<C = ActionContext<GameState, Mutations>> {
  [GameActions.CLEAR_DRAWING]: (context: C, payload: DrawingPayload) => Promise<void>
  [GameActions.UNDO]: (context: C, payload: DrawingPayload) => Promise<void>
  [GameActions.REDO]: (context: C, payload: DrawingPayload) => Promise<void>
  [GameActions.START_DRAW_POINT]: (context: C, payload: Point) => Promise<void>
  [GameActions.STOP_DRAW_POINT]: (
    context: C,
    payload: StopDrawingPayload,
  ) => Promise<Line>
}

export const actions: ActionTree<GameState, GameState> & Actions = {
  [GameActions.CLEAR_DRAWING]: async (
    { commit },
    payload: DrawingPayload,
  ): Promise<void> => {
    const { sendEvent, user } = payload
    commit(GameMutations.CLEAR_DRAWING)
    sendEvent(EventType.Draw, {
      user,
      type: DrawEventType.CLEAR,
    })
  },
  [GameActions.UNDO]: async ({ commit }, payload: DrawingPayload): Promise<void> => {
    const { sendEvent, user } = payload
    commit(GameMutations.UNDO)
    sendEvent(EventType.Draw, {
      user,
      type: DrawEventType.UNDO,
    })
  },
  [GameActions.REDO]: async ({ commit }, payload: DrawingPayload): Promise<void> => {
    const { sendEvent, user } = payload
    commit(GameMutations.REDO)
    sendEvent(EventType.Draw, {
      user,
      type: DrawEventType.REDO,
    })
  },
  [GameActions.START_DRAW_POINT]: async ({ commit }, point: Point): Promise<void> => {
    commit(GameMutations.SET_IS_DRAWING, true)
    commit(GameMutations.ADD_POINT, point)
  },
  [GameActions.STOP_DRAW_POINT]: async (
    { commit, getters },
    payload: StopDrawingPayload,
  ): Promise<Line> => {
    const { point, user, sendEvent } = payload
    commit(GameMutations.SET_IS_DRAWING, false)
    commit(GameMutations.ADD_POINT, point)

    const line: Line = getters.getLatestLine()

    commit(GameMutations.ADD_LINE, line)
    sendEvent(EventType.Draw, {
      user,
      line,
      type: DrawEventType.LINE,
    })
    return line
  },
}
