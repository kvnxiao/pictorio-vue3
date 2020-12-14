<template>
  <div class="game">
    <div id="player-info" class="game-panel" :style="{ height: canvasHeight }">
      <div class="wrapper">
        <PlayerInfo />
      </div>
    </div>

    <div
      id="center"
      ref="center"
      class="game-panel"
      :style="{ maxWidth: maxWidthPixels }"
    >
      <div class="wrapper">
        <div class="aspect-ratio">
          <template v-if="gameMounted && gameStatus === 1">
            <Drawing
              :canvas-width="width"
              :canvas-height="height"
              :max-canvas-width="maxWidth"
            />
          </template>
          <template v-else-if="gameMounted && gameStatus === 0">
            <Waiting />
          </template>
          <template v-else>
            <div />
          </template>
        </div>
      </div>
    </div>

    <div id="chat" class="game-panel" :style="{ height: canvasHeight }">
      <div class="wrapper">
        <Chat />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ChatEvent,
  EventType,
  GameStatus,
  ReadyEvent,
  RehydrateEvent,
  StartGameEvent,
  UserJoinLeaveAction,
  UserJoinLeaveEvent,
} from "@/models/events"
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  watchEffect,
} from "vue"
import { BASE_WS_URL } from "@/api/endpoints"
import Chat from "@/components/game/Chat.vue"
import { ChatMutations } from "@/store/chatStore/mutations"
import Drawing from "@/components/game/Drawing.vue"
import { GameMutations } from "@/store/gameStore/mutations"
import PlayerInfo from "@/components/game/PlayerInfo.vue"
import { UserMutations } from "@/store/userStore/mutations"
import Waiting from "@/components/game/Waiting.vue"
import { onEvent } from "@/game/events"
import { useChatStore } from "@/store/chatStore"
import { useGameStore } from "@/store/gameStore"
import { useGlobalWebSocket } from "@/game/websocket"
import { useResizeObserver } from "@/composables/useResizeObserver"
import { useRoute } from "vue-router"
import { useUserStore } from "@/store/userStore"

export default defineComponent({
  name: "Game",
  components: {
    Chat,
    Drawing,
    PlayerInfo,
    Waiting,
  },
  setup() {
    const {
      params: { roomID },
    } = useRoute()
    const userStore = useUserStore()
    const chatStore = useChatStore()
    const gameStore = useGameStore()

    const { connect, disconnect, error } = useGlobalWebSocket()

    const gameMounted = ref<boolean>(false)
    const gameStatus = computed<GameStatus>(() => gameStore.state.gameStatus)
    const center = ref<HTMLDivElement | null>(null)
    const maxWidth = ref<number>(1500)
    const { width, height } = useResizeObserver(center)

    const canvasHeight = computed<string>(() => `${height.value}px`)
    const maxWidthPixels = computed<string>(() => `${maxWidth.value}px`)

    const onConnected = () => {
      console.log("Connected to game server!")
    }

    const onDisconnected = () => {
      console.log("Disconnected from game server!")
    }

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

    watchEffect(() => {
      if (error.value) {
        console.log(error.value)
      }
    })

    onMounted(() => {
      gameMounted.value = true
      connect(`${BASE_WS_URL}/room/${roomID}/ws`, onConnected, onDisconnected)
    })

    onUnmounted(() => {
      gameMounted.value = false
      disconnect()
    })

    return {
      canvasHeight,
      center,
      height,
      gameStatus,
      gameMounted,
      maxWidth,
      maxWidthPixels,
      width,
    }
  },
})
</script>

<style lang="sass" scoped>
.game
  display: flex
  width: 100%
  height: calc(100% - 52px)
  align-items: center
  justify-content: center

.wrapper
  border-radius: 10px
  background: white
  display: block
  position: relative
  width: 100%
  height: 100%
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02)

#center
  width: 70%

.aspect-ratio
  padding-top: (10 / 16) * 100%

#chat, #player-info
  width: 15%

.game-panel
  margin: 0.5rem
  &:first-of-type
    margin-left: 1rem
  &:last-of-type
    margin-right: 1rem
</style>
