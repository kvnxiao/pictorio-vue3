import { Line, Point } from "@/models/drawing"
import { GameState } from "./state"
import { GetterTree } from "vuex"

export interface Getters<S = GameState> {
  getLatestTwoPoints(state: S): () => Point[]
  getLatestLine(state: S): () => Line
}

export const getters: GetterTree<GameState, GameState> & Getters = {
  getLatestTwoPoints: (state: GameState) => (): Point[] => {
    const lastIndex = state.points.length - 1
    return [state.points[lastIndex - 1], state.points[lastIndex]]
  },

  getLatestLine: (state: GameState) => (): Line => {
    const line = {
      points: [...state.points],
      colourIdx: state.colourIndex,
      thicknessIdx: state.thicknessIndex,
    }
    return line
  },
}
