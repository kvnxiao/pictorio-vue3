export enum GameStatus {
  NOT_LOADED = -1,
  WAITING_READY_UP = 0,
  STARTED = 1,
  GAME_OVER = 2,
}

export enum TurnStatus {
  NEXT_PLAYER = 0,
  SELECTION = 1,
  DRAWING = 2,
  ENDED = 3,
}
