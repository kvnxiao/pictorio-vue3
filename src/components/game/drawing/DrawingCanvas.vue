<template>
  <canvas
    ref="canvasRef"
    class="bg-white w-full h-full absolute top-0 left-0 rounded-md"
  />
  <canvas
    ref="topCanvasRef"
    class="pointer-events-none w-full h-full absolute top-0 left-0 rounded-md"
  />
  <Toolbelt
    v-if="isDrawerTurn"
    :self-user="selfUser"
    @tool-clear="clearDrawing()"
    @tool-undo="undoDrawing()"
    @tool-redo="redoDrawing()"
  />
</template>

<script lang="ts">
import { InputEvent, useInputCoordinates } from "@/composables/useInputCoordinates"
import { Line, scaledPoint } from "@/models/drawing"
import {
  PropType,
  computed,
  defineComponent,
  onMounted,
  ref,
  toRef,
  watch,
  watchEffect,
} from "vue"
import { GameActions } from "@/store/gameStore/actions"
import { GameMutations } from "@/store/gameStore/mutations"
import Toolbelt from "@/components/game/drawing/Toolbelt.vue"
import { TurnStatus } from "@/models/status"
import { User } from "@/models/user"
import { throttle } from "lodash"
import { useDualLayerCanvasContext } from "@/game/canvas"
import { useGameEvents } from "@/game/events"
import { useGameStore } from "@/store/gameStore"
import { useGlobalWebSocket } from "@/game/websocket"

export default defineComponent({
  name: "DrawingCanvas",
  components: { Toolbelt },
  props: {
    selfUser: {
      type: Object as PropType<User>,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    isDrawerTurn: {
      type: Boolean,
      default: false,
    },
    canvasHeight: {
      type: Number,
      default: 0,
    },
    canvasWidth: {
      type: Number,
      default: 0,
    },
    maxCanvasWidth: {
      type: Number,
      default: 0,
    },
    turnStatus: {
      type: Number as PropType<TurnStatus>,
      required: true,
    },
  },
  setup(props) {
    const { send } = useGlobalWebSocket()
    const { sendEvent } = useGameEvents(send)

    const canvasRef = ref<HTMLCanvasElement | null>(null)
    const topCanvasRef = ref<HTMLCanvasElement | null>(null)
    const {
      x,
      y,
      button,
      eventType,
      isTargetted: isTargetCanvas,
    } = useInputCoordinates(topCanvasRef, canvasRef)

    const {
      drawTemp,
      drawMain,
      clearTemp,
      clearMain,
      resize,
    } = useDualLayerCanvasContext(canvasRef, topCanvasRef)

    const gameStore = useGameStore()
    const lines = computed<Line[]>(() => gameStore.state.lines)
    const scale = computed<number>(() => gameStore.state.scale)
    const isDrawing = computed<boolean>(() => gameStore.state.isDrawing)
    const colourIdx = computed<number>(() => gameStore.state.colourIndex)
    const thicknessIdx = computed<number>(() => gameStore.state.thicknessIndex)

    const drawMainCanvas = () => {
      for (const line of lines.value) {
        drawMain(line, scale.value)
      }
    }

    const resetBoard = (newScale: number, width: number, height: number) => {
      resize(width, height)
      clearTemp()
      clearMain()
      gameStore.commit(GameMutations.SET_SCALE, newScale)
      drawMainCanvas()
    }

    // Resize watcher to redraw contents onto screen
    watch(
      [toRef(props, "canvasWidth"), toRef(props, "canvasHeight")],
      ([width, height]) => {
        const newScale = width / props.maxCanvasWidth
        resetBoard(newScale, width, height)
      },
    )

    // Hydration watcher for players who are not drawing (not self-user's turn)
    watch(
      () => gameStore.state.lines.length,
      (len) => {
        if (len === 0) {
          clearTemp()
          clearMain()
        } else {
          clearTemp()
          clearMain()
          drawMainCanvas()
        }
      },
    )

    // Hydration watcher for temporary line, for players who are not drawing
    watch(
      () => gameStore.state.points.length,
      (length: number, prevLength: number) => {
        if (length > 0 && !props.isDrawerTurn) {
          const startingIndex = prevLength > 1 ? prevLength - 2 : 0
          for (let i = startingIndex; i < length - 2; i++) {
            const p1 = gameStore.state.points[i]
            const p2 = gameStore.state.points[i + 1]
            drawTemp(p1, p2, scale.value, colourIdx.value, thicknessIdx.value)
          }
        }
      },
    )

    // Watch turn status to clear the canvas on each new turn
    watch(
      () => props.turnStatus,
      (curr: TurnStatus) => {
        if (curr === TurnStatus.NEXT_PLAYER) {
          gameStore.commit(GameMutations.CLEAR_DRAWING)
          clearTemp()
          clearMain()
        }
      },
    )

    onMounted(() => {
      // Reset drawing on component mount
      const newScale = props.canvasWidth / props.maxCanvasWidth
      resetBoard(newScale, props.canvasWidth, props.canvasHeight)
    })

    const onDrawStart = async (x: number, y: number) => {
      if (props.enabled && props.isDrawerTurn) {
        await gameStore.dispatch(GameActions.START_DRAW_POINT, {
          point: scaledPoint(x, y, scale.value),
          sendEvent,
          user: props.selfUser,
        })
      }
    }

    const onDrawMove = async (x: number, y: number) => {
      if (isDrawing.value) {
        gameStore.dispatch(GameActions.ADD_POINT, {
          point: scaledPoint(x, y, scale.value),
          sendEvent,
          user: props.selfUser,
        })

        const [p1, p2] = gameStore.getters.getLatestTwoPoints()
        drawTemp(p1, p2, scale.value, colourIdx.value, thicknessIdx.value)
      }
    }

    const onDrawStop = async (x: number, y: number) => {
      if (isDrawing.value) {
        await gameStore.dispatch(GameActions.STOP_DRAW_POINT, {
          point: scaledPoint(x, y, scale.value),
          sendEvent,
          user: props.selfUser,
        })
      }
    }

    const throttledDrawMove = throttle(onDrawMove, 1000 / 120)

    watchEffect(async () => {
      switch (eventType.value) {
        case InputEvent.MOVE: {
          await throttledDrawMove(x.value, y.value)
          break
        }
        case InputEvent.CLICK: {
          if (isTargetCanvas.value && button.value === 0) {
            await onDrawStart(x.value, y.value)
          }
          break
        }
        case InputEvent.RELEASE: {
          await onDrawStop(x.value, y.value)
          break
        }
      }
    })

    const clearDrawing = async () => {
      await gameStore.dispatch(GameActions.CLEAR_DRAWING, {
        sendEvent,
        user: props.selfUser,
      })
      clearTemp()
      clearMain()
    }

    const undoDrawing = async () => {
      await gameStore.dispatch(GameActions.UNDO, {
        sendEvent,
        user: props.selfUser,
      })
      clearTemp()
      clearMain()
      drawMainCanvas()
    }

    const redoDrawing = async () => {
      await gameStore.dispatch(GameActions.REDO, {
        sendEvent,
        user: props.selfUser,
      })
      clearTemp()
      clearMain()
      drawMainCanvas()
    }

    return {
      canvasRef,
      topCanvasRef,
      clearDrawing,
      undoDrawing,
      redoDrawing,
    }
  },
})
</script>
