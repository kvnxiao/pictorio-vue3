import { Line, Point } from "@/models/drawing"

export interface GameState {
  isDrawing: boolean
  colourIdx: number
  thicknessIdx: number
  points: Point[]
  lines: Line[]
  scale: number
  redoStack: Line[]
}

export const state: GameState = {
  isDrawing: false,
  colourIdx: 0,
  thicknessIdx: 0,
  points: [],
  lines: [],
  scale: 1,
  redoStack: [],
}
