import { Line, Point } from "@/models/drawing"
import { GameState } from "./state"
import { MutationTree } from "vuex"
import { Player } from "@/models/player"

export enum MutationTypes {
  // Event mutations
  SET_SELF_PLAYER = "SET_SELF_PLAYER",
  // Game drawing mutations
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
  // Event mutations
  [MutationTypes.SET_SELF_PLAYER](state: S, payload: Player): void
  // Game drawing mutations
  [MutationTypes.SET_THICKNESS_IDX](state: S, payload: number): void
  [MutationTypes.SET_COLOUR_IDX](state: S, payload: number): void
  [MutationTypes.SET_SCALE](state: S, payload: number): void
  [MutationTypes.SET_IS_DRAWING](state: S, payload: boolean): void
  [MutationTypes.ADD_POINT](state: S, payload: Point): void
  [MutationTypes.ADD_LINE](state: S, payload: Line): void
  [MutationTypes.ADD_REDO_STACK_LINE](state: S, payload: Line): void
  [MutationTypes.CLEAR_DRAWING](state: S): void
  [MutationTypes.UNDO](state: S): void
  [MutationTypes.REDO](state: S): void
}

export const mutations: MutationTree<GameState> & Mutations = {
  [MutationTypes.SET_SELF_PLAYER](state: GameState, player: Player) {
    state.selfPlayer = player
  },
  [MutationTypes.SET_THICKNESS_IDX](state: GameState, index: number) {
    state.thicknessIdx = index
  },
  [MutationTypes.SET_COLOUR_IDX](state: GameState, index: number) {
    state.colourIdx = index
  },
  [MutationTypes.SET_SCALE](state: GameState, scale: number) {
    state.scale = scale
  },
  [MutationTypes.SET_IS_DRAWING](state: GameState, isDrawing: boolean) {
    state.isDrawing = isDrawing
    if (!isDrawing) {
      state.redoStack.splice(0, state.redoStack.length)
    }
  },
  [MutationTypes.ADD_POINT](state: GameState, point: Point) {
    state.points.push(point)
  },
  [MutationTypes.ADD_LINE](state: GameState, line: Line) {
    state.lines.push(line)
    state.points.splice(0, state.points.length)
  },
  [MutationTypes.ADD_REDO_STACK_LINE](state: GameState, line: Line) {
    state.redoStack.push(line)
  },
  [MutationTypes.CLEAR_DRAWING](state: GameState) {
    state.lines.splice(0, state.lines.length)
    state.redoStack.splice(0, state.redoStack.length)
  },
  [MutationTypes.UNDO](state: GameState) {
    const line = state.lines.pop()
    if (line) {
      state.redoStack.push(line)
    }
  },
  [MutationTypes.REDO](state: GameState) {
    const line = state.redoStack.pop()
    if (line) {
      state.lines.push(line)
    }
  },
}
