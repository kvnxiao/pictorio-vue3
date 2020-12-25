import { GameStatus, TurnStatus } from "@/models/status"
import { Line, Point } from "@/models/drawing"
import { User } from "@/models/user"
import { Winner } from "@/models/winner"

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
  // Ephemeral game state
  wordSelections: string[] | null
  currentWord: string | null
  currentWordLength: number[] | null
  currentTurnUser: User | null
  timeLeftSeconds: number
  winners: Winner[] | null
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
  // Players
  maxPlayers: 0,
  playerCount: 0,
  // Game rounds
  maxRounds: 0,
  round: 0,
  // Statuses
  gameStatus: GameStatus.NOT_LOADED,
  turnStatus: TurnStatus.SELECTION,
  // Turn specific data
  maxNextUpTime: 0,
  maxSelectionTime: 0,
  maxDrawingTime: 0,
  maxEndTime: 0,
  playerOrderIds: [],
  // Ephemeral game state
  wordSelections: null,
  currentWord: null,
  currentWordLength: null,
  currentTurnUser: null,
  timeLeftSeconds: -1,
  winners: null,
  // Drawing state
  isDrawing: false,
  colourIndex: 0,
  thicknessIndex: 0,
  points: [],
  lines: [],
  redoStack: [],
  scale: 1,
}
