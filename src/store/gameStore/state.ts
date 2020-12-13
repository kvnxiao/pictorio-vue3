import { Line, Point } from "@/models/drawing"
import { GameStatus } from "@/models/events"
import { User } from "@/models/user"

export interface GameState {
  maxPlayers: number
  gameStatus: GameStatus
  playerOrderIds: string[]
  currentUserTurn: User | null
  isDrawing: boolean
  colourIdx: number
  thicknessIdx: number
  points: Point[]
  lines: Line[]
  scale: number
  redoStack: Line[]
}

export const state: GameState = {
  maxPlayers: 0,
  gameStatus: GameStatus.WaitingReadyUp,
  playerOrderIds: [],
  currentUserTurn: null,
  isDrawing: false,
  colourIdx: 0,
  thicknessIdx: 0,
  points: [],
  lines: [],
  scale: 1,
  redoStack: [],
}
