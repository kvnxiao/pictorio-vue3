import {
  ChatEvent,
  DrawEvent,
  DrawEventType,
  EventType,
  GameEvent,
  GameEventTypeMap,
  ReadyEvent,
  RehydrateEvent,
  StartGameEvent,
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
  sendEvent(eventType: EventType, eventData: GameEventTypeMap[EventType]): void
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

  onEvent(EventType.RehydrateEvent, (event: RehydrateEvent) => {
    userStore.commit(UserMutations.REHYDRATE, event)
    chatStore.commit(ChatMutations.REHYDRATE, event)
    gameStore.commit(GameMutations.REHYDRATE, event)
  })

  onEvent(EventType.ReadyEvent, (event: ReadyEvent) => {
    userStore.commit(UserMutations.USER_READY, event)
  })

  onEvent(EventType.StartGameEvent, (event: StartGameEvent) => {
    gameStore.commit(GameMutations.START_GAME, event)
  })

  onEvent(EventType.ChatEvent, (event: ChatEvent) => {
    chatStore.commit(ChatMutations.ADD_MESSAGE, {
      message: event.message,
      user: event.user,
      isSystem: event.isSystem,
    })
  })

  onEvent(EventType.UserJoinLeaveEvent, (event: UserJoinLeaveEvent) => {
    if (event.action === UserJoinLeaveAction.JOIN) {
      userStore.commit(UserMutations.USER_JOINED, event.playerState)
    } else {
      userStore.commit(UserMutations.USER_LEFT, event.playerState)
    }
  })

  onEvent(EventType.DrawEvent, (event: DrawEvent) => {
    console.log("Received drawing event!")
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
}

export function deregisterEventListeners(): void {
  removeListeners()
}
