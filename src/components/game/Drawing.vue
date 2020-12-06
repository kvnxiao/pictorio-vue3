<template>
  <div id="drawing">
    <canvas id="canvas" ref="canvasRef" />
    <canvas id="top-canvas" ref="topCanvasRef" />
    <Toolbelt
      @tool-clear="clearDrawing()"
      @tool-undo="undoDrawing()"
      @tool-redo="redoDrawing()"
    />
  </div>
</template>

<script lang="ts">
import { InputEvent, useInputCoordinates } from "@/composables/useInputCoordinates"
import { Ref, computed, defineComponent, ref, toRef, watch, watchEffect } from "vue"
import { GameMutations } from "@/store/gameStore/mutations"
import Toolbelt from "@/components/game/drawing/Toolbelt.vue"
import { scaledPoint } from "@/models/drawing"
import { useDualLayerCanvasContext } from "@/game/canvas"
import { useGameState } from "@/store/gameStore"

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
    const canvasRef: Ref<HTMLCanvasElement | null> = ref(null)
    const topCanvasRef: Ref<HTMLCanvasElement | null> = ref(null)
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

    const gameState = useGameState()
    const lines = computed(() => gameState.state.lines)
    const scale = computed(() => gameState.state.scale)
    const isDrawing = computed(() => gameState.state.isDrawing)
    const colourIdx = computed(() => gameState.state.colourIdx)
    const thicknessIdx = computed(() => gameState.state.thicknessIdx)

    const drawMainCanvas = () => {
      for (const line of lines.value) {
        drawMain(line, scale.value)
      }
    }

    // Resize watcher to redraw contents onto screen
    watch(
      [toRef(props, "canvasWidth"), toRef(props, "canvasHeight")],
      ([width, height]) => {
        const newScale = width / props.maxCanvasWidth
        resize(width, height)
        clearTemp()
        clearMain()
        gameState.commit(GameMutations.SET_SCALE, newScale)
        drawMainCanvas()
      },
    )

    const onDrawStart = (x: number, y: number) => {
      gameState.commit(GameMutations.SET_IS_DRAWING, true)
      const point = scaledPoint(x, y, scale.value)
      gameState.commit(GameMutations.ADD_POINT, point)
    }

    const onDrawMove = (x: number, y: number) => {
      if (isDrawing.value) {
        const point = scaledPoint(x, y, scale.value)
        gameState.commit(GameMutations.ADD_POINT, point)

        const [p1, p2] = gameState.getters.getLatestTwoPoints()
        drawTemp(p1, p2, scale.value, colourIdx.value, thicknessIdx.value)
      }
    }

    const onDrawStop = (x: number, y: number) => {
      if (isDrawing.value) {
        gameState.commit(GameMutations.SET_IS_DRAWING, false)

        const point = scaledPoint(x, y, scale.value)
        gameState.commit(GameMutations.ADD_POINT, point)

        // Draw line on main layer canvas, then add line to history
        const line = gameState.getters.getLatestLine()
        drawMain(line, scale.value)
        gameState.commit(GameMutations.ADD_LINE, line)
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

    const clearDrawing = () => {
      gameState.commit(GameMutations.CLEAR_DRAWING)
      clearTemp()
      clearMain()
    }

    const undoDrawing = () => {
      gameState.commit(GameMutations.UNDO)
      clearMain()
      drawMainCanvas()
    }

    const redoDrawing = () => {
      gameState.commit(GameMutations.REDO)
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
