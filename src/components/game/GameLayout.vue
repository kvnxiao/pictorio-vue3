<template>
  <div
    class="flex w-full h-full items-center justify-center flex-col p-2 space-y-2 xl:flex-row xl:space-x-4 xl:space-y-0 xl:p-4"
  >
    <div ref="left" class="panel-left" :style="desktopPanelStyle">
      <div class="bg-white rounded-lg w-full h-full shadow-lg block relative">
        <PanelLeft
          :self-user="selfUser"
          :drawing-user="drawingUser"
          :status="gameStatus"
          :turn-status="turnStatus"
        />
      </div>
    </div>

    <div ref="center" class="panel-center" :style="{ maxWidth: maxWidthPx }">
      <div class="bg-white rounded-lg w-full h-full shadow-lg block relative">
        <div class="aspect-ratio">
          <PanelCenter
            :self-user="selfUser"
            :drawing-user="drawingUser"
            :status="gameStatus"
            :turn-status="turnStatus"
            :dyn-width="width"
            :dyn-height="height"
            :dyn-max-width="maxWidth"
            :is-desktop-width="isDesktopWidth"
          />
        </div>
      </div>
    </div>

    <div ref="right" class="panel-right" :style="desktopPanelStyle">
      <div class="bg-white rounded-lg w-full h-full shadow-lg block relative">
        <PanelRight
          :self-user="selfUser"
          :status="gameStatus"
          :turn-status="turnStatus"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { GameStatus, TurnStatus } from "@/models/status"
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRefs,
  watchEffect,
} from "vue"
import { useRoute, useRouter } from "vue-router"
import PanelCenter from "@/components/game/panels/PanelCenter.vue"
import PanelLeft from "@/components/game/panels/PanelLeft.vue"
import PanelRight from "@/components/game/panels/PanelRight.vue"
import { Panels } from "@/models/panels"
import { ROOM_EXISTS } from "@/api/endpoints"
import { RoomResponse } from "@/service/room"
import { ToastMessageMutations } from "@/store/toastMsgStore/mutations"
import { User } from "@/models/user"
import { registerGameEvents } from "@/composables/registerGameEvents"
import { service } from "@/service"
import { useGameStore } from "@/store/gameStore"
import { useGlobalWebSocket } from "@/game/websocket"
import { useResizeObserver } from "@/composables/useResizeObserver"
import { useToastMsgStore } from "@/store/toastMsgStore"
import { useUserStore } from "@/store/userStore"

export default defineComponent({
  name: "GameLayout",
  components: {
    PanelCenter,
    PanelLeft,
    PanelRight,
  },
  async setup() {
    // Stores
    const userStore = useUserStore()
    const gameStore = useGameStore()
    const selfUser = computed<User>(() => userStore.state.selfUser)
    const drawingUser = computed<User | null>(() => gameStore.state.currentTurnUser)
    const gameStatus = computed<GameStatus>(() => gameStore.state.gameStatus)
    const turnStatus = computed<TurnStatus>(() => gameStore.state.turnStatus)

    // Routes
    const {
      params: { roomID },
    } = useRoute()
    const router = useRouter()
    const toastMsgStore = useToastMsgStore()

    // Async loading
    const isValidRoom = ref<boolean>(false)
    const loading = ref<boolean>(true)

    // Layout size (dynamic width & height)
    const panels: Panels = reactive({
      left: null,
      center: null,
      right: null,
    })
    const { left, center, right } = toRefs(panels)
    const { width, height } = useResizeObserver(center)
    const maxWidth = ref<number>(1500)
    const { width: vw } = useResizeObserver(ref(document.body))
    const maxWidthPx = computed<string>(() => `${maxWidth.value}px`)
    const isDesktopWidth = computed<boolean>(() => vw.value > 1280)
    const desktopPanelStyle = computed(() => {
      return {
        height: isDesktopWidth.value ? `${height.value}px` : "auto",
      }
    })

    // WebSocket events
    const ws = useGlobalWebSocket()
    const { beforeConnect, connectGame, disconnectGame } = registerGameEvents(ws)

    onBeforeMount(() => {
      beforeConnect()
    })

    // Redirect if room is invalid
    onMounted(() => {
      watchEffect(() => {
        if (!loading.value && !isValidRoom.value) {
          toastMsgStore.commit(ToastMessageMutations.SET, {
            message: "This room does not exist",
            type: "error",
          })
          router.push("/")
          return
        } else {
          toastMsgStore.commit(ToastMessageMutations.SET, {
            message: "You have joined the room!",
            type: "info",
          })
          connectGame(roomID as string)
        }
      })
    })

    onBeforeUnmount(() => {
      disconnectGame()
    })

    // Check room is valid on initial setup
    try {
      const resp = await service.post<RoomResponse>(ROOM_EXISTS, {
        roomID: roomID as string,
      })
      isValidRoom.value = resp.data.exists
      loading.value = false
    } catch (err) {
      isValidRoom.value = false
      loading.value = false
    }

    return {
      left,
      center,
      right,
      vw,
      maxWidthPx,
      selfUser,
      drawingUser,
      gameStatus,
      turnStatus,
      width,
      height,
      maxWidth,
      desktopPanelStyle,
      isDesktopWidth,
    }
  },
})
</script>
