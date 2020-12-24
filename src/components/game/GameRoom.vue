<template>
  <div class="flex w-full h-full items-center justify-center space-x-4 p-4">
    <div id="players" :style="{ height: canvasHeight }">
      <div class="bg-white rounded-lg w-full h-full shadow-lg block relative">
        <Players />
      </div>
    </div>

    <div id="center" ref="center" :style="{ maxWidth: maxWidthPixels }">
      <div class="bg-white rounded-lg w-full h-full shadow-lg block relative">
        <div class="aspect-ratio">
          <template v-if="gameStatus === GameStatus.Started">
            <Drawing
              :canvas-width="width"
              :canvas-height="height"
              :max-canvas-width="maxWidth"
            />
            <Guess v-if="turnStatus === TurnStatus.DRAWING" :drawer="drawingUser" />
            <Selection
              v-if="
                turnStatus === TurnStatus.SELECTION ||
                turnStatus === TurnStatus.NEXT_PLAYER
              "
              :drawer="drawingUser"
            />
            <Timer :max-seconds="maxTime" :seconds="timeLeft" show />
          </template>

          <template v-else-if="gameStatus === GameStatus.WaitingReadyUp">
            <Waiting />
          </template>

          <template v-else>
            <div />
          </template>
        </div>
      </div>
    </div>

    <div id="chat" :style="{ height: canvasHeight }">
      <div class="bg-white rounded-lg w-full h-full shadow-lg block relative">
        <Chat />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { GameStatus, TurnStatus } from "@/models/status"
import { ROOM_EXISTS, ROOM_WS } from "@/api/endpoints"
import { RoomRequest, RoomResponse } from "@/service/room"
import {
  computed,
  defineComponent,
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  watchEffect,
} from "vue"
import { deregisterEventListeners, registerEventListeners } from "@/game/events"
import { useRoute, useRouter } from "vue-router"
import Chat from "@/components/game/panels/Chat.vue"
import { ChatMutations } from "@/store/chatStore/mutations"
import Drawing from "@/components/game/panels/Drawing.vue"
import { GameEvent } from "@/models/events"
import { GameMutations } from "@/store/gameStore/mutations"
import Guess from "@/components/game/guess/Guess.vue"
import Players from "@/components/game/panels/Players.vue"
import Selection from "@/components/game/panels/Selection.vue"
import Timer from "@/components/game/timer/Timer.vue"
import { ToastMessageMutations } from "@/store/toastMsgStore/mutations"
import { User } from "@/models/user"
import { UserMutations } from "@/store/userStore/mutations"
import Waiting from "@/components/game/panels/Waiting.vue"
import service from "@/service"
import { useChatStore } from "@/store/chatStore"
import { useGameEvents } from "@/game/events"
import { useGameStore } from "@/store/gameStore"
import { useGlobalWebSocket } from "@/game/websocket"
import { useResizeObserver } from "@/composables/useResizeObserver"
import { useToastMsgStore } from "@/store/toastMsgStore"
import { useUserStore } from "@/store/userStore"

function isGameEvent(data: unknown): data is GameEvent {
  return typeof data === "object" && (data as GameEvent).type !== undefined
}

export default defineComponent({
  name: "GameRoom",
  components: {
    Chat,
    Drawing,
    Guess,
    Players,
    Selection,
    Timer,
    Waiting,
  },
  async setup() {
    const {
      params: { roomID },
    } = useRoute()
    const router = useRouter()
    const toastMsgStore = useToastMsgStore()
    const validRoom = ref<boolean>(false)

    const chatStore = useChatStore()
    const userStore = useUserStore()
    const gameStore = useGameStore()
    const { connect, disconnect, error, send } = useGlobalWebSocket()
    const { emitEvent } = useGameEvents(send)

    const gameStatus = computed<GameStatus>(() => gameStore.state.gameStatus)
    const turnStatus = computed<TurnStatus>(() => gameStore.state.turnStatus)
    const drawingUser = computed<User | null>(() => gameStore.state.currentTurnUser)
    const center = ref<HTMLDivElement | null>(null)
    const maxWidth = ref<number>(1500)
    const { width, height } = useResizeObserver(center)

    const canvasHeight = computed<string>(() => `${height.value}px`)
    const maxWidthPixels = computed<string>(() => `${maxWidth.value}px`)

    // Timer
    const maxTime = computed<number>(() => {
      switch (turnStatus.value) {
        case TurnStatus.NEXT_PLAYER:
          return gameStore.state.maxNextUpTime
        case TurnStatus.SELECTION:
          return gameStore.state.maxSelectionTime
        case TurnStatus.DRAWING:
          return gameStore.state.maxTurnTime
        default:
          return 0
      }
    })
    const timeLeft = computed<number>(() => gameStore.state.timeLeftSeconds)

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

    watchEffect(() => {
      if (error.value) {
        console.log(error.value)
      }
    })

    onBeforeMount(() => {
      // Reset store states
      userStore.commit(UserMutations.RESET)
      gameStore.commit(GameMutations.RESET)
      chatStore.commit(ChatMutations.RESET)

      // Register event listeners on websocket connection
      registerEventListeners()
    })

    onMounted(() => {
      if (!validRoom.value) {
        toastMsgStore.commit(ToastMessageMutations.SET, {
          message: "This room does not exist",
          type: "error",
        })
        router.push("/")
        return
      }

      connect(ROOM_WS(roomID as string), onWsConnected, onWsDisconnected, onWsMessage)
    })

    onUnmounted(() => {
      disconnect()
      deregisterEventListeners()
    })

    // Check room is valid on initial setup
    const roomRequest: RoomRequest = {
      roomID: roomID as string,
    }

    const resp = await service.post<RoomResponse>(ROOM_EXISTS, roomRequest)
    validRoom.value = resp.data.exists

    return {
      canvasHeight,
      center,
      height,
      gameStatus,
      turnStatus,
      drawingUser,
      maxWidth,
      maxWidthPixels,
      width,
      GameStatus,
      TurnStatus,
      maxTime,
      timeLeft,
    }
  },
})
</script>

<style lang="sass" scoped>
#center
  width: 70%

.aspect-ratio
  padding-top: (10 / 16) * 100%

#chat, #players
  width: 15%
</style>
