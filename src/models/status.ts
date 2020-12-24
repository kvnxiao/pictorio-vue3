export enum GameStatus {
  NOT_LOADED = -1,
  WaitingReadyUp = 0,
  Started = 1,
  GameOver = 2,
}

export enum TurnStatus {
  NEXT_PLAYER = 0,
  SELECTION = 1,
  DRAWING = 2,
  ENDED = 3,
}
