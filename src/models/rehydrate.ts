import { Line } from "./drawing"
import { ChatEvent } from "./events"
import { PlayerState } from "./playerState"
import { GameStatus, TurnStatus } from "./status"
import { User } from "./user"
import { Winner } from "./winner"

export interface UserRehydrate {
  selfUser: User
  currentTurnUser: User | null
}

export interface ChatRehydrate {
  chatMessages: ChatEvent[]
}

export interface PlayersRehydrate {
  players: {
    playerStates: PlayerState[]
    maxPlayers: number
  }
}

export interface GameRehydrate {
  game: {
    maxRounds: number
    maxNextUpTime: number
    maxSelectionTime: number
    maxDrawingTime: number
    maxEndTime: number
    round: number
    timeLeft: number
    status: GameStatus
    turnStatus: TurnStatus
    playerOrderIds: string[] | null
    words: {
      word: string
      wordLength: number[] | null
      selections: string[] | null
    }
    winners: Winner[] | null
  }
}

export interface DrawingRehydrate {
  lines: Line[]
}
