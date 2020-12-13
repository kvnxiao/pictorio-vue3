import { Line, Point } from "@/models/drawing"
import { GameRehydrateEvent } from "@/models/events"
import { GameState } from "./state"
import { MutationTree } from "vuex"

export enum GameMutations {
  REHYDRATE = "REHYDRATE",
  SET_THICKNESS_IDX = "SET_THICKNESS_IDX",
  SET_COLOUR_IDX = "SET_COLOUR_IDX",
  SET_SCALE = "SET_SCALE",
  SET_IS_DRAWING = "SET_IS_DRAWING",
  ADD_POINT = "ADD_POINT",
  ADD_LINE = "ADD_LINE",
  ADD_REDO_STACK_LINE = "ADD_REDO_STACK_LINE",
  CLEAR_DRAWING = "CLEAR_DRAWING",
  UNDO = "UNDO",
  REDO = "REDO",
}

export interface Mutations<S = GameState> {
  [GameMutations.REHYDRATE](state: S, payload: GameRehydrateEvent): void
  [GameMutations.SET_THICKNESS_IDX](state: S, payload: number): void
  [GameMutations.SET_COLOUR_IDX](state: S, payload: number): void
  [GameMutations.SET_SCALE](state: S, payload: number): void
  [GameMutations.SET_IS_DRAWING](state: S, payload: boolean): void
  [GameMutations.ADD_POINT](state: S, payload: Point): void
  [GameMutations.ADD_LINE](state: S, payload: Line): void
  [GameMutations.ADD_REDO_STACK_LINE](state: S, payload: Line): void
  [GameMutations.CLEAR_DRAWING](state: S): void
  [GameMutations.UNDO](state: S): void
  [GameMutations.REDO](state: S): void
}

export const mutations: MutationTree<GameState> & Mutations = {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  [GameMutations.REHYDRATE](state: GameState, event: GameRehydrateEvent) {
    // TODO
  },
  [GameMutations.SET_THICKNESS_IDX](state: GameState, index: number) {
    state.thicknessIdx = index
  },
  [GameMutations.SET_COLOUR_IDX](state: GameState, index: number) {
    state.colourIdx = index
  },
  [GameMutations.SET_SCALE](state: GameState, scale: number) {
    state.scale = scale
  },
  [GameMutations.SET_IS_DRAWING](state: GameState, isDrawing: boolean) {
    state.isDrawing = isDrawing
    if (!isDrawing) {
      state.redoStack.splice(0, state.redoStack.length)
    }
  },
  [GameMutations.ADD_POINT](state: GameState, point: Point) {
    state.points.push(point)
  },
  [GameMutations.ADD_LINE](state: GameState, line: Line) {
    state.lines.push(line)
    state.points.splice(0, state.points.length)
  },
  [GameMutations.ADD_REDO_STACK_LINE](state: GameState, line: Line) {
    state.redoStack.push(line)
  },
  [GameMutations.CLEAR_DRAWING](state: GameState) {
    state.lines.splice(0, state.lines.length)
    state.redoStack.splice(0, state.redoStack.length)
  },
  [GameMutations.UNDO](state: GameState) {
    const line = state.lines.pop()
    if (line) {
      state.redoStack.push(line)
    }
  },
  [GameMutations.REDO](state: GameState) {
    const line = state.redoStack.pop()
    if (line) {
      state.lines.push(line)
    }
  },
}
