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
  maxNextUpTime: number
  maxSelectionTime: number
  maxDrawingTime: number
  maxEndTime: number
  playerOrderIds: string[]
  wordSelections: string[] | null
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
  maxNextUpTime: 0,
  maxSelectionTime: 0,
  maxDrawingTime: 0,
  maxEndTime: 0,
  playerOrderIds: [],
  wordSelections: null,
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
