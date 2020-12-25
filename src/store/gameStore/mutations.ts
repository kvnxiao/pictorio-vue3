import { GameStatus, TurnStatus } from "@/models/status"
import { Line, Point } from "@/models/drawing"
import {
  RehydrateEvent,
  StartGameEvent,
  TurnBeginDrawingEvent,
  TurnBeginSelectionEvent,
  TurnCountdownEvent,
  TurnDrawingNextEvent,
} from "@/models/events"
import { GameState } from "./state"
import { MutationTree } from "vuex"

export enum GameMutations {
  RESET = "RESET",
  REHYDRATE = "REHYDRATE",
  START_GAME = "START_GAME",
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
  // Turn related
  NEXT_PLAYER = "NEXT_PLAYER",
  BEGIN_TURN_SELECTION = "BEGIN_TURN_SELECTION",
  BEGIN_TURN_DRAWING = "BEGIN_TURN_DRAWING",
  TURN_COUNTDOWN = "TURN_COUNTDOWN",
  CLEAR_COUNTDOWN = "CLEAR_COUNTDOWN",
}

export interface Mutations<S = GameState> {
  [GameMutations.RESET](state: S): void
  [GameMutations.REHYDRATE](state: S, payload: RehydrateEvent): void
  [GameMutations.START_GAME](state: S, payload: StartGameEvent): void
  [GameMutations.SET_THICKNESS_IDX](state: S, payload: number): void
  [GameMutations.SET_COLOUR_IDX](state: S, payload: number): void
  [GameMutations.SET_SCALE](state: S, payload: number): void
  [GameMutations.SET_IS_DRAWING](state: S, payload: boolean): void
  [GameMutations.ADD_POINT](state: S, payload: Point): void
  [GameMutations.ADD_LINE](state: S, payload: Line): void
  [GameMutations.ADD_REDO_STACK_LINE](state: S, payload: Line): void
  [GameMutations.CLEAR_DRAWING](state: S): void
  [GameMutations.UNDO](state: S): void
  [GameMutations.REDO](state: S): void
  [GameMutations.NEXT_PLAYER](state: S, payload: TurnDrawingNextEvent): void
  [GameMutations.BEGIN_TURN_SELECTION](state: S, payload: TurnBeginSelectionEvent): void
  [GameMutations.BEGIN_TURN_DRAWING](state: S, payload: TurnBeginDrawingEvent): void
  [GameMutations.TURN_COUNTDOWN](state: S, payload: TurnCountdownEvent): void
  [GameMutations.CLEAR_COUNTDOWN](state: S): void
}

export const mutations: MutationTree<GameState> & Mutations = {
  [GameMutations.RESET](state: GameState) {
    // Reset game status state
    state.maxPlayers = 0
    state.playerCount = 0
    state.maxRounds = 0
    state.round = 0
    state.gameStatus = GameStatus.NOT_LOADED
    state.turnStatus = TurnStatus.SELECTION
    state.maxNextUpTime = 0
    state.maxSelectionTime = 0
    state.maxTurnTime = 0
    state.playerOrderIds.splice(0, state.playerOrderIds.length)
    state.wordSelections = null
    state.currentWord = null
    state.currentWordLength = null
    state.currentTurnUser = null
    state.timeLeftSeconds = -1

    // Reset drawing state
    state.isDrawing = false
    state.colourIndex = 0
    state.thicknessIndex = 0
    state.points.splice(0, state.points.length)
    state.lines.splice(0, state.lines.length)
    state.redoStack.splice(0, state.redoStack.length)
    state.scale = 1
  },
  [GameMutations.REHYDRATE](state: GameState, event: RehydrateEvent) {
    state.maxPlayers = event.players.maxPlayers
    state.maxRounds = event.game.maxRounds
    state.round = event.game.round
    state.gameStatus = event.game.status
    state.turnStatus = event.game.turnStatus
    state.maxNextUpTime = event.game.maxNextUpTime
    state.maxSelectionTime = event.game.maxSelectionTime
    state.maxTurnTime = event.game.maxTurnTime
    if (event.game.playerOrderIds) {
      state.playerOrderIds = event.game.playerOrderIds
    }
    state.wordSelections = event.game.words.selections
    state.currentWord = event.game.words.word
    state.currentWordLength = event.game.words.wordLength
    if (event.currentTurnUser) {
      state.currentTurnUser = event.currentTurnUser
    }
    state.timeLeftSeconds = event.game.timeLeft
    state.lines = event.lines ? event.lines : []
  },
  [GameMutations.START_GAME](state: GameState, event: StartGameEvent) {
    state.gameStatus = GameStatus.STARTED
    state.playerOrderIds = event.playerOrderIds

    // reset drawing
    state.lines.splice(0, state.lines.length)
    state.redoStack.splice(0, state.redoStack.length)
  },
  [GameMutations.SET_THICKNESS_IDX](state: GameState, index: number) {
    state.thicknessIndex = index
  },
  [GameMutations.SET_COLOUR_IDX](state: GameState, index: number) {
    state.colourIndex = index
  },
  [GameMutations.SET_SCALE](state: GameState, scale: number) {
    state.scale = scale
  },
  [GameMutations.SET_IS_DRAWING](state: GameState, isDrawing: boolean) {
    state.isDrawing = isDrawing
    if (!isDrawing) {
      state.redoStack.splice(0, state.redoStack.length)
    }
  },
  [GameMutations.ADD_POINT](state: GameState, point: Point) {
    state.points.push(point)
  },
  [GameMutations.ADD_LINE](state: GameState, line: Line) {
    state.lines.push(line)
    state.points.splice(0, state.points.length)
  },
  [GameMutations.ADD_REDO_STACK_LINE](state: GameState, line: Line) {
    state.redoStack.push(line)
  },
  [GameMutations.CLEAR_DRAWING](state: GameState) {
    state.lines.splice(0, state.lines.length)
    state.redoStack.splice(0, state.redoStack.length)
  },
  [GameMutations.UNDO](state: GameState) {
    const line = state.lines.pop()
    if (line) {
      state.redoStack.push(line)
    }
  },
  [GameMutations.REDO](state: GameState) {
    const line = state.redoStack.pop()
    if (line) {
      state.lines.push(line)
    }
  },
  [GameMutations.NEXT_PLAYER](state: GameState, payload: TurnDrawingNextEvent) {
    if (payload.nextTurnUser) {
      state.turnStatus = TurnStatus.NEXT_PLAYER
      state.currentTurnUser = payload.nextTurnUser
      state.maxNextUpTime = payload.maxTime
      state.timeLeftSeconds = payload.timeLeft
    } else {
      state.timeLeftSeconds = payload.timeLeft
    }
  },
  [GameMutations.BEGIN_TURN_SELECTION](
    state: GameState,
    event: TurnBeginSelectionEvent,
  ) {
    // set turn status to word selection state
    state.turnStatus = TurnStatus.SELECTION

    // set time limits
    state.maxSelectionTime = event.maxTime
    state.timeLeftSeconds = event.maxTime

    // set word selections (null for non-drawing players)
    state.wordSelections = event.words ?? null

    // current word is resetted
    state.currentWord = null
    state.currentWordLength = null
  },
  [GameMutations.BEGIN_TURN_DRAWING](state: GameState, event: TurnBeginDrawingEvent) {
    // set turn status to drawing state
    state.turnStatus = TurnStatus.DRAWING

    // clear word selection memory, even for current drawer
    state.wordSelections = null

    // set time limits
    state.maxTurnTime = event.maxTime

    // set current word (null for non-drawing players)
    state.currentWord = event.word ?? null
    state.currentWordLength = event.wordLength
  },
  [GameMutations.TURN_COUNTDOWN](state: GameState, payload: TurnCountdownEvent) {
    state.timeLeftSeconds = payload.timeLeft
  },
  [GameMutations.CLEAR_COUNTDOWN](state: GameState) {
    state.timeLeftSeconds = 0
  },
}
