import { Line, Point } from "@/models/drawing"
import { GameStatus } from "@/models/events"
import { User } from "@/models/user"

export interface GameState {
  gameStatus: GameStatus
  currentUserTurn?: User
  isDrawing: boolean
  colourIdx: number
  thicknessIdx: number
  points: Point[]
  lines: Line[]
  scale: number
  redoStack: Line[]
}

export const state: GameState = {
  gameStatus: GameStatus.WaitingReadyUp,
  isDrawing: false,
  colourIdx: 0,
  thicknessIdx: 0,
  points: [],
  lines: [],
  scale: 1,
  redoStack: [],
}
