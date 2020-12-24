import {
  AwardPointsEvent,
  ChatEvent,
  DrawEvent,
  DrawEventType,
  EventType,
  GameEvent,
  GameEventTypeMap,
  ReadyEvent,
  RehydrateEvent,
  StartGameEvent,
  TurnBeginDrawingEvent,
  TurnBeginSelectionEvent,
  TurnCountdownEvent,
  TurnDrawingNextEvent,
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
    console.log(event)
    userStore.commit(UserMutations.REHYDRATE, event)
    chatStore.commit(ChatMutations.REHYDRATE, event)
    gameStore.commit(GameMutations.REHYDRATE, event)
  })

  onEvent(EventType.Ready, (event: ReadyEvent) => {
    userStore.commit(UserMutations.USER_READY, event)
  })

  onEvent(EventType.StartGame, (event: StartGameEvent) => {
    gameStore.commit(GameMutations.START_GAME, event)
  })

  onEvent(EventType.Chat, (event: ChatEvent) => {
    chatStore.commit(ChatMutations.ADD_MESSAGE, {
      message: event.message,
      user: event.user,
      isSystem: event.isSystem,
    })
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
      case DrawEventType.LINE:
        if (event.line) {
          gameStore.commit(GameMutations.ADD_LINE, event.line)
        }
        break
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

  onEvent(EventType.TurnDrawingNext, (event: TurnDrawingNextEvent) => {
    gameStore.commit(GameMutations.NEXT_PLAYER, event)
  })

  onEvent(EventType.TurnBeginSelection, (event: TurnBeginSelectionEvent) => {
    gameStore.commit(GameMutations.BEGIN_TURN_SELECTION, event)
  })

  onEvent(EventType.TurnBeginDrawing, (event: TurnBeginDrawingEvent) => {
    gameStore.commit(GameMutations.BEGIN_TURN_DRAWING, event)
  })

  onEvent(EventType.TurnCountdown, (event: TurnCountdownEvent) => {
    gameStore.commit(GameMutations.TURN_COUNTDOWN, event)
  })

  onEvent(EventType.AwardPoints, (event: AwardPointsEvent) => {
    userStore.commit(UserMutations.ADD_POINTS, event)
  })
}

export function deregisterEventListeners(): void {
  removeListeners()
}
