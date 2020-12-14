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
import { GameEvent, GameStatus } from "@/models/events"
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
import Drawing from "@/components/game/Drawing.vue"
import PlayerInfo from "@/components/game/PlayerInfo.vue"
import Waiting from "@/components/game/Waiting.vue"
import { registerEventListeners } from "@/game/events"
import { useGameEvents } from "@/game/events"
import { useGameStore } from "@/store/gameStore"
import { useGlobalWebSocket } from "@/game/websocket"
import { useResizeObserver } from "@/composables/useResizeObserver"
import { useRoute } from "vue-router"

function isGameEvent(data: unknown): data is GameEvent {
  return typeof data === "object" && (data as GameEvent).type !== undefined
}

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
    const gameStore = useGameStore()

    const { connect, disconnect, error, send } = useGlobalWebSocket()
    const { emitEvent } = useGameEvents(send)

    const gameMounted = ref<boolean>(false)
    const gameStatus = computed<GameStatus>(() => gameStore.state.gameStatus)
    const center = ref<HTMLDivElement | null>(null)
    const maxWidth = ref<number>(1500)
    const { width, height } = useResizeObserver(center)

    const canvasHeight = computed<string>(() => `${height.value}px`)
    const maxWidthPixels = computed<string>(() => `${maxWidth.value}px`)

    const onWsConnected = () => {
      /* eslint-disable no-console */
      console.log("Connected to game server!")
    }

    const onWsDisconnected = () => {
      /* eslint-disable no-console */
      console.log("Disconnected from game server!")
    }

    const onWsMessage = (event: MessageEvent) => {
      try {
        const wsData = JSON.parse(event.data)
        if (isGameEvent(wsData)) {
          emitEvent(wsData.type, wsData.data)
        }
      } catch (err) {
        /* eslint-disable no-console */
        console.error(err)
      }
    }

    registerEventListeners()

    watchEffect(() => {
      if (error.value) {
        console.log(error.value)
      }
    })

    onMounted(() => {
      gameMounted.value = true
      connect(
        `${BASE_WS_URL}/room/${roomID}/ws`,
        onWsConnected,
        onWsDisconnected,
        onWsMessage,
      )
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
