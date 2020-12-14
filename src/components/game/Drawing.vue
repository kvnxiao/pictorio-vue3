<template>
  <div id="drawing">
    <canvas id="canvas" ref="canvasRef" />
    <canvas id="top-canvas" ref="topCanvasRef" />
    <Toolbelt
      v-if="isMyTurn"
      @tool-clear="clearDrawing()"
      @tool-undo="undoDrawing()"
      @tool-redo="redoDrawing()"
    />
  </div>
</template>

<script lang="ts">
import { InputEvent, useInputCoordinates } from "@/composables/useInputCoordinates"
import { Line, scaledPoint } from "@/models/drawing"
import {
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
import { useDualLayerCanvasContext } from "@/game/canvas"
import { useGameStore } from "@/store/gameStore"
import { useUserStore } from "@/store/userStore"

export default defineComponent({
  name: "Drawing",
  components: { Toolbelt },
  props: {
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
  },
  setup(props) {
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
    const userStore = useUserStore()
    const lines = computed<Line[]>(() => gameStore.state.lines)
    const scale = computed<number>(() => gameStore.state.scale)
    const isDrawing = computed<boolean>(() => gameStore.state.isDrawing)
    const colourIdx = computed<number>(() => gameStore.state.colourIdx)
    const thicknessIdx = computed<number>(() => gameStore.state.thicknessIdx)
    const isMyTurn = computed<boolean>(
      () =>
        gameStore.state.currentUserTurn?.id === userStore.state.selfUser.id ?? false,
    )

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

    onMounted(() => {
      // Reset drawing on component mount
      const newScale = props.canvasWidth / props.maxCanvasWidth
      resetBoard(newScale, props.canvasWidth, props.canvasHeight)
    })

    const onDrawStart = (x: number, y: number) => {
      if (isMyTurn.value) {
        gameStore.commit(GameMutations.SET_IS_DRAWING, true)
        const point = scaledPoint(x, y, scale.value)
        gameStore.commit(GameMutations.ADD_POINT, point)
      }
    }

    const onDrawMove = (x: number, y: number) => {
      if (isMyTurn.value && isDrawing.value) {
        const point = scaledPoint(x, y, scale.value)
        gameStore.commit(GameMutations.ADD_POINT, point)

        const [p1, p2] = gameStore.getters.getLatestTwoPoints()
        drawTemp(p1, p2, scale.value, colourIdx.value, thicknessIdx.value)
      }
    }

    const onDrawStop = (x: number, y: number) => {
      if (isMyTurn.value && isDrawing.value) {
        gameStore.commit(GameMutations.SET_IS_DRAWING, false)

        const point = scaledPoint(x, y, scale.value)
        gameStore.commit(GameMutations.ADD_POINT, point)

        // Draw line on main layer canvas, then add line to history
        const line = gameStore.getters.getLatestLine()
        drawMain(line, scale.value)
        gameStore.commit(GameMutations.ADD_LINE, line)
        clearTemp()
      }
    }

    watchEffect(() => {
      switch (eventType.value) {
        case InputEvent.MOVE: {
          onDrawMove(x.value, y.value)
          break
        }
        case InputEvent.CLICK: {
          if (isTargetCanvas.value && button.value === 0) {
            onDrawStart(x.value, y.value)
          }
          break
        }
        case InputEvent.RELEASE: {
          onDrawStop(x.value, y.value)
          break
        }
      }
    })

    const clearDrawing = async () => {
      await gameStore.dispatch(GameActions.CLEAR_DRAWING)
      clearTemp()
      clearMain()
    }

    const undoDrawing = async () => {
      await gameStore.dispatch(GameActions.UNDO)
      clearMain()
      drawMainCanvas()
    }

    const redoDrawing = async () => {
      await gameStore.dispatch(GameActions.REDO)
      clearMain()
      drawMainCanvas()
    }

    return {
      canvasRef,
      topCanvasRef,
      clearDrawing,
      undoDrawing,
      redoDrawing,
      isMyTurn,
    }
  },
})
</script>

<style lang="sass" scoped>
#drawing
  height: 0

#canvas, #top-canvas
  border-radius: 10px
  width: 100%
  height: 100%
  position: absolute
  top: 0
  left: 0

#canvas
  background: #FFFFFF

#top-canvas
  pointer-events: none
</style>
