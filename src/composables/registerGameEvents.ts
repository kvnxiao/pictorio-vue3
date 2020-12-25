import { ChatStore, useChatStore } from "@/store/chatStore"
import { GameStore, useGameStore } from "@/store/gameStore"
import { UserStore, useUserStore } from "@/store/userStore"
import {
  deregisterEventListeners,
  registerEventListeners,
  useGameEvents,
} from "@/game/events"
import { ChatMutations } from "@/store/chatStore/mutations"
import { GameEvent } from "@/models/events"
import { GameMutations } from "@/store/gameStore/mutations"
import { GlobalWebSocket } from "@/game/websocket/useGlobalWebSocket"
import { ROOM_WS } from "@/api/endpoints"
import { UserMutations } from "@/store/userStore/mutations"
import { watchEffect } from "vue"

function isGameEvent(data: unknown): data is GameEvent {
  return typeof data === "object" && (data as GameEvent).type !== undefined
}

function onWsConnected() {
  console.log("Connected to game server!")
}

function onWsDisconnected() {
  console.log("Disconnected from game server!")
}

interface RegisteredGameEvents {
  beforeConnect(): void
  connectGame(roomID: string): void
  disconnectGame(): void
}

function resetStores(chatStore: ChatStore, userStore: UserStore, gameStore: GameStore) {
  // Reset store states
  userStore.commit(UserMutations.RESET)
  gameStore.commit(GameMutations.RESET)
  chatStore.commit(ChatMutations.RESET)
}

export function registerGameEvents({
  connect,
  disconnect,
  send,
  error,
}: GlobalWebSocket): RegisteredGameEvents {
  const chatStore: ChatStore = useChatStore()
  const userStore: UserStore = useUserStore()
  const gameStore: GameStore = useGameStore()
  const { emitEvent } = useGameEvents(send)

  const onWsMessage = (event: MessageEvent) => {
    try {
      const wsData = JSON.parse(event.data)
      if (isGameEvent(wsData)) {
        emitEvent(wsData.type, wsData.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  watchEffect(() => {
    if (error.value) {
      console.error("Encountered WebSocket error: ", error.value)
    }
  })

  const beforeConnect = () => {
    resetStores(chatStore, userStore, gameStore)
    registerEventListeners()
  }

  const connectGame = (roomID: string) => {
    connect(ROOM_WS(roomID), onWsConnected, onWsDisconnected, onWsMessage)
  }

  const disconnectGame = () => {
    resetStores(chatStore, userStore, gameStore)
    disconnect()
    deregisterEventListeners()
  }

  return {
    beforeConnect,
    connectGame,
    disconnectGame,
  }
}
