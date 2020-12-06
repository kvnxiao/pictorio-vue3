import { Line, Point } from "@/models/drawing"
import { Player } from "@/models/player"

export interface GameState {
  // Players
  selfPlayer: Player

  // Drawing state
  isDrawing: boolean
  colourIdx: number
  thicknessIdx: number
  points: Point[]
  lines: Line[]
  scale: number
  redoStack: Line[]
}

export const state: GameState = {
  selfPlayer: { id: "", name: "" },
  isDrawing: false,
  colourIdx: 0,
  thicknessIdx: 0,
  points: [],
  lines: [],
  scale: 1,
  redoStack: [],
}
