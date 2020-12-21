import { GameStatus, TurnStatus } from "@/models/status"
import { Line, Point } from "@/models/drawing"
import { User } from "@/models/user"

export interface GameStatusState {
  // Players
  maxPlayers: number
  playerCount: number
  // Game rounds
  maxRounds: number
  round: number
  // Statuses
  gameStatus: GameStatus
  turnStatus: TurnStatus
  // Turn specific data
  playerOrderIds: string[]
  currentWord: string | null
  currentWordLength: number[] | null
  currentTurnUser: User | null
  timeLeftSeconds: number
}

export interface DrawingState {
  isDrawing: boolean
  colourIndex: number
  thicknessIndex: number
  points: Point[]
  lines: Line[]
  redoStack: Line[]
  scale: number
}

export type GameState = GameStatusState & DrawingState

export const state: GameState = {
  // game status state
  maxPlayers: 0,
  playerCount: 0,
  maxRounds: 0,
  round: 0,
  gameStatus: GameStatus.NOT_LOADED,
  turnStatus: TurnStatus.SELECTION,
  playerOrderIds: [],
  currentWord: null,
  currentWordLength: null,
  currentTurnUser: null,
  timeLeftSeconds: -1,
  // drawing state
  isDrawing: false,
  colourIndex: 0,
  thicknessIndex: 0,
  points: [],
  lines: [],
  redoStack: [],
  scale: 1,
}
