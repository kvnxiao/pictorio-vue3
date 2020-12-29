import { DrawEventType, EventType, GameEventTypeMap } from "@/models/events"
import { GameMutations, Mutations } from "./mutations"
import type { ActionContext } from "../types"
import { ActionTree } from "vuex"
import { GameState } from "./state"
import { Point } from "@/models/drawing"
import { User } from "@/models/user"
import { throttle } from "lodash"

export enum GameActions {
  CLEAR_DRAWING = "CLEAR_DRAWING",
  UNDO = "UNDO",
  REDO = "REDO",
  START_DRAW_POINT = "START_DRAW_POINT",
  ADD_POINT = "ADD_POINT",
  STOP_DRAW_POINT = "STOP_DRAW_POINT",
  SELECT_COLOUR = "SELECT_COLOUR",
  SELECT_THICKNESS = "SELECT_THICKNESS",
  SELECT_WORD = "SELECT_WORD",
}

type SendableEvent = <T extends keyof GameEventTypeMap>(
  eventType: T,
  eventData: GameEventTypeMap[T],
) => void

interface Sendable {
  sendEvent: SendableEvent
}

export interface DrawingPayload extends Sendable {
  user: User
}

export interface PointDrawingPayload extends Sendable {
  user: User
  point: Point
}

export interface SelectWordPayload extends Sendable {
  user: User
  index: number
}

export interface SelectColourPayload extends Sendable {
  user: User
  colourIdx: number
}

export interface SelectThicknessPayload extends Sendable {
  user: User
  thicknessIdx: number
}

const tempPoints: Point[] = []

const sendTempDrawingPoint = (
  sendEvent: SendableEvent,
  user: User,
  colourIdx: number,
  thicknessIdx: number,
  eventType: EventType.DrawTemp | EventType.DrawTempStop,
) => {
  const cutOffPoints = tempPoints.splice(0, tempPoints.length)
  if (cutOffPoints.length === 0) {
    return
  }
  sendEvent(eventType, {
    user,
    line: {
      colourIdx,
      thicknessIdx,
      points: cutOffPoints,
    },
  })
}

const throttledSendTempDrawingPoint = throttle(sendTempDrawingPoint, 1000 / 30)

export interface Actions<C = ActionContext<GameState, Mutations>> {
  [GameActions.CLEAR_DRAWING]: (context: C, payload: DrawingPayload) => Promise<void>
  [GameActions.UNDO]: (context: C, payload: DrawingPayload) => Promise<void>
  [GameActions.REDO]: (context: C, payload: DrawingPayload) => Promise<void>
  [GameActions.ADD_POINT]: (context: C, payload: PointDrawingPayload) => Promise<void>
  [GameActions.START_DRAW_POINT]: (
    context: C,
    payload: PointDrawingPayload,
  ) => Promise<void>
  [GameActions.STOP_DRAW_POINT]: (
    context: C,
    payload: PointDrawingPayload,
  ) => Promise<void>
  [GameActions.SELECT_WORD]: (context: C, payload: SelectWordPayload) => Promise<void>
  [GameActions.SELECT_COLOUR]: (
    context: C,
    payload: SelectColourPayload,
  ) => Promise<void>
  [GameActions.SELECT_THICKNESS]: (
    context: C,
    payload: SelectThicknessPayload,
  ) => Promise<void>
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
  [GameActions.ADD_POINT]: async (
    { commit, state },
    { point, user, sendEvent }: PointDrawingPayload,
  ): Promise<void> => {
    tempPoints.push(point)
    commit(GameMutations.ADD_POINT, point)

    throttledSendTempDrawingPoint(
      sendEvent,
      user,
      state.colourIndex,
      state.thicknessIndex,
      EventType.DrawTemp,
    )
  },
  [GameActions.START_DRAW_POINT]: async (
    { commit, state },
    { point, user, sendEvent }: PointDrawingPayload,
  ): Promise<void> => {
    tempPoints.push(point)
    commit(GameMutations.SET_IS_DRAWING, true)
    commit(GameMutations.ADD_POINT, point)

    sendTempDrawingPoint(
      sendEvent,
      user,
      state.colourIndex,
      state.thicknessIndex,
      EventType.DrawTemp,
    )
  },
  [GameActions.STOP_DRAW_POINT]: async (
    { commit, state },
    { point, user, sendEvent }: PointDrawingPayload,
  ): Promise<void> => {
    tempPoints.push(point)
    commit(GameMutations.ADD_POINT, point)
    commit(GameMutations.SET_IS_DRAWING, false)

    sendTempDrawingPoint(
      sendEvent,
      user,
      state.colourIndex,
      state.thicknessIndex,
      EventType.DrawTempStop,
    )
    tempPoints.splice(0, tempPoints.length)
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
  [GameActions.SELECT_COLOUR]: async (
    { commit }: ActionContext<GameState, Mutations>,
    { colourIdx, user, sendEvent }: SelectColourPayload,
  ): Promise<void> => {
    commit(GameMutations.SET_COLOUR_IDX, colourIdx)
    sendEvent(EventType.DrawSelectColour, {
      colourIdx,
      user,
    })
  },
  [GameActions.SELECT_THICKNESS]: async (
    { commit }: ActionContext<GameState, Mutations>,
    { thicknessIdx, user, sendEvent }: SelectThicknessPayload,
  ): Promise<void> => {
    commit(GameMutations.SET_THICKNESS_IDX, thicknessIdx)
    sendEvent(EventType.DrawSelectThickness, {
      thicknessIdx,
      user,
    })
  },
}
