import {
  AwardPointsEvent,
  ChatEvent,
  DrawEvent,
  DrawEventType,
  DrawSelectColourEvent,
  DrawSelectThicknessEvent,
  DrawTempEvent,
  EventType,
  GameEvent,
  GameEventTypeMap,
  GameOverEvent,
  NewGameResetEvent,
  ReadyEvent,
  RehydrateEvent,
  StartGameEvent,
  TurnDrawingEvent,
  TurnEndEvent,
  TurnNextPlayerEvent,
  TurnWordSelectionEvent,
  UserJoinLeaveAction,
  UserJoinLeaveEvent,
} from "@/models/events"
import { ChatMutations } from "@/store/chatStore/mutations"
import { EventEmitter } from "events"
import { GameMutations } from "@/store/gameStore/mutations"
import { UserMutations } from "@/store/userStore/mutations"
import { useChatStore } from "@/store/chatStore"
import { useGameStore } from "@/store/gameStore"
import { useUserStore } from "@/store/userStore"

const globalEmitter = new EventEmitter()

const onEvent = <T extends keyof GameEventTypeMap>(
  eventType: T,
  listener: (event: GameEventTypeMap[T]) => void,
) => {
  globalEmitter.on(eventType, listener)
}

const removeListeners = () => {
  globalEmitter.removeAllListeners()
}

const emitEvent = (eventType: EventType, eventData: unknown) => {
  globalEmitter.emit(eventType, eventData)
}

interface GameEvents {
  onEvent<T extends keyof GameEventTypeMap>(
    eventType: T,
    listener: (event: GameEventTypeMap[T]) => void,
  ): void
  sendEvent<T extends keyof GameEventTypeMap>(
    eventType: T,
    eventData: GameEventTypeMap[T],
  ): void
  emitEvent(eventType: EventType, eventData: unknown): void
  removeListeners(): void
}

export function useGameEvents(
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void,
): GameEvents {
  const sendEvent = <T extends keyof GameEventTypeMap>(
    eventType: T,
    eventData: GameEventTypeMap[T],
  ) => {
    const gameEvent: GameEvent = {
      type: eventType,
      data: eventData,
    }
    send(JSON.stringify(gameEvent))
  }

  return {
    onEvent,
    sendEvent,
    emitEvent,
    removeListeners,
  }
}

export function registerEventListeners(): void {
  const userStore = useUserStore()
  const chatStore = useChatStore()
  const gameStore = useGameStore()

  onEvent(EventType.Rehydrate, (event: RehydrateEvent) => {
    userStore.commit(UserMutations.REHYDRATE, event)
    chatStore.commit(ChatMutations.REHYDRATE, event)
    gameStore.commit(GameMutations.REHYDRATE, event)
  })

  onEvent(EventType.Ready, (event: ReadyEvent) => {
    userStore.commit(UserMutations.USER_READY, event)
  })

  onEvent(EventType.StartGame, (event: StartGameEvent) => {
    gameStore.commit(GameMutations.START_GAME, event)
    userStore.commit(UserMutations.START_GAME, event)
  })

  onEvent(EventType.Chat, (event: ChatEvent) => {
    chatStore.commit(ChatMutations.ADD_MESSAGE, event)
  })

  onEvent(EventType.UserJoinLeave, (event: UserJoinLeaveEvent) => {
    if (event.action === UserJoinLeaveAction.JOIN) {
      userStore.commit(UserMutations.USER_JOINED, event.playerState)
    } else {
      userStore.commit(UserMutations.USER_LEFT, event.playerState)
    }
  })

  onEvent(EventType.Draw, (event: DrawEvent) => {
    switch (event.type) {
      case DrawEventType.CLEAR:
        gameStore.commit(GameMutations.CLEAR_DRAWING)
        break
      case DrawEventType.UNDO:
        gameStore.commit(GameMutations.UNDO)
        break
      case DrawEventType.REDO:
        gameStore.commit(GameMutations.REDO)
        break
    }
  })

  onEvent(EventType.DrawTemp, (event: DrawTempEvent) => {
    gameStore.commit(GameMutations.ADD_TEMP_POINTS, event.line.points)
  })

  onEvent(EventType.TurnNextPlayer, (event: TurnNextPlayerEvent) => {
    gameStore.commit(GameMutations.NEXT_PLAYER, event)
  })

  onEvent(EventType.TurnWordSelection, (event: TurnWordSelectionEvent) => {
    gameStore.commit(GameMutations.TURN_WORD_SELECTION, event)
  })

  onEvent(EventType.TurnDrawing, (event: TurnDrawingEvent) => {
    gameStore.commit(GameMutations.TURN_DRAWING, event)
  })

  onEvent(EventType.TurnEnd, (event: TurnEndEvent) => {
    gameStore.commit(GameMutations.TURN_END, event)
  })

  onEvent(EventType.AwardPoints, (event: AwardPointsEvent) => {
    userStore.commit(UserMutations.ADD_POINTS, event)
  })

  onEvent(EventType.GameOver, (event: GameOverEvent) => {
    gameStore.commit(GameMutations.GAME_OVER, event)
  })

  onEvent(EventType.NewGameReset, (event: NewGameResetEvent) => {
    gameStore.commit(GameMutations.RESET)
    gameStore.commit(GameMutations.NEW_GAME)
    userStore.commit(UserMutations.NEW_GAME, event)
  })

  onEvent(EventType.DrawSelectColour, (event: DrawSelectColourEvent) => {
    gameStore.commit(GameMutations.SET_COLOUR_IDX, event.colourIdx)
  })

  onEvent(EventType.DrawSelectThickness, (event: DrawSelectThicknessEvent) => {
    gameStore.commit(GameMutations.SET_THICKNESS_IDX, event.thicknessIdx)
  })

  onEvent(EventType.DrawTempStop, (event: DrawTempEvent) => {
    gameStore.commit(GameMutations.ADD_TEMP_POINTS, event.line.points)
    gameStore.commit(GameMutations.PROMOTE_LINE, gameStore.getters.getLatestLine())
  })
}

export function deregisterEventListeners(): void {
  removeListeners()
}
