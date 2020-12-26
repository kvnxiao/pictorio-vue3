import { DrawEventType, EventType, GameEventTypeMap } from "@/models/events"
import { GameMutations, Mutations } from "./mutations"
import { Line, Point } from "@/models/drawing"
import type { ActionContext } from "../types"
import { ActionTree } from "vuex"
import { GameState } from "./state"
import { User } from "@/models/user"
import { chunk } from "lodash"

export enum GameActions {
  CLEAR_DRAWING = "CLEAR_DRAWING",
  UNDO = "UNDO",
  REDO = "REDO",
  START_DRAW_POINT = "START_DRAW_POINT",
  STOP_DRAW_POINT = "STOP_DRAW_POINT",
  SELECT_WORD = "SELECT_WORD",
}

interface Sendable {
  sendEvent<T extends keyof GameEventTypeMap>(
    eventType: T,
    eventData: GameEventTypeMap[T],
  ): void
}

export interface DrawingPayload extends Sendable {
  user: User
}

export interface StopDrawingPayload extends Sendable {
  user: User
  point: Point
}

export interface SelectWordPayload extends Sendable {
  user: User
  index: number
}

// TODO: split payload to send to server
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function splitLinesPayload(line: Line): Line[] {
  const chunkedPoints = chunk<Point>(line.points, 100)
  return chunkedPoints.map((points: Point[]) => {
    return {
      points: points,
      colourIdx: line.colourIdx,
      thicknessIdx: line.thicknessIdx,
    }
  })
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
  [GameActions.SELECT_WORD]: (context: C, payload: SelectWordPayload) => Promise<void>
}

export const actions: ActionTree<GameState, GameState> & Actions = {
  [GameActions.CLEAR_DRAWING]: async (
    { commit },
    { sendEvent, user }: DrawingPayload,
  ): Promise<void> => {
    commit(GameMutations.CLEAR_DRAWING)
    sendEvent(EventType.Draw, {
      user,
      type: DrawEventType.CLEAR,
    })
  },
  [GameActions.UNDO]: async (
    { commit },
    { sendEvent, user }: DrawingPayload,
  ): Promise<void> => {
    commit(GameMutations.UNDO)
    sendEvent(EventType.Draw, {
      user,
      type: DrawEventType.UNDO,
    })
  },
  [GameActions.REDO]: async (
    { commit },
    { sendEvent, user }: DrawingPayload,
  ): Promise<void> => {
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
    { point, user, sendEvent }: StopDrawingPayload,
  ): Promise<Line> => {
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
  [GameActions.SELECT_WORD]: async (
    _: ActionContext<GameState, Mutations>,
    { index, user, sendEvent }: SelectWordPayload,
  ): Promise<void> => {
    sendEvent(EventType.TurnWordSelected, {
      index,
      user,
    })
  },
}
