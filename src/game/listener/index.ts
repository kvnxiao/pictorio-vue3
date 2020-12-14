import {
  ChatEvent,
  EventType,
  ReadyEvent,
  RehydrateEvent,
  StartGameEvent,
  UserJoinLeaveAction,
  UserJoinLeaveEvent,
} from "@/models/events"
import { ChatMutations } from "@/store/chatStore/mutations"
import { GameMutations } from "@/store/gameStore/mutations"
import { UserMutations } from "@/store/userStore/mutations"
import { onEvent } from "../events"
import { useChatStore } from "@/store/chatStore"
import { useGameStore } from "@/store/gameStore"
import { useUserStore } from "@/store/userStore"

export function registerEventListeners() {
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
}
