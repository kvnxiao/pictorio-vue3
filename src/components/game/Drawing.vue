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
import { Ref, defineComponent, ref, toRef, watch, watchEffect } from "vue"
import { useRoute } from "vue-router"
import Toolbelt from "@/components/game/drawing/Toolbelt.vue"
import { scaledPoint } from "@/models/drawing"
import { useDualLayerCanvasContext } from "@/game/canvas"
import { useGlobalDrawingState } from "@/game/drawingState"
import { useGlobalWebSocket } from "@/composables/useGlobalWebSocket"

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
    const { connect, sendJSON } = useGlobalWebSocket();
    const { params } = useRoute();
    const roomID = params.roomID;
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
      isDrawing,
      points,
      lines,
      scale,
      colourIdx,
      thicknessIdx,
      redoStack,
      getLatestTwoPoints,
      getLatestLine,
    } = useGlobalDrawingState()
    const {
      drawTemp,
      drawMain,
      clearTemp,
      clearMain,
      resize,
    } = useDualLayerCanvasContext(canvasRef, topCanvasRef)

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
        scale.value = newScale
        drawMainCanvas()
      },
    )

    const onPencilDown = (x: number, y: number) => {
      isDrawing.value = true
      const point = scaledPoint(x, y, scale.value)
      points.value.push(point)
    }

    const onPencilMove = (x: number, y: number) => {
      if (isDrawing.value) {
        const point = scaledPoint(x, y, scale.value)
        points.value.push(point)

        const [p1, p2] = getLatestTwoPoints()
        drawTemp(p1, p2, scale.value, colourIdx.value, thicknessIdx.value)
      }
    }

    const onPencilUp = (x: number, y: number) => {
      if (isDrawing.value) {
        isDrawing.value = false
        redoStack.value.splice(0, redoStack.value.length)

        const point = scaledPoint(x, y, scale.value)
        points.value.push(point)

        // Draw line on main layer canvas, then add line to history
        const line = getLatestLine()
        drawMain(line, scale.value)
        lines.value.push(line)
        points.value = []
        sendJSON(line);
        clearTemp()
      }
    }

    watchEffect(() => {
      switch (eventType.value) {
        case InputEvent.MOVE: {
          onPencilMove(x.value, y.value)
          break
        }
        case InputEvent.CLICK: {
          if (isTargetCanvas.value && button.value === 0) {
            onPencilDown(x.value, y.value)
          }
          break
        }
        case InputEvent.RELEASE: {
          onPencilUp(x.value, y.value)
          break
        }
      }
    })

    const clearDrawing = () => {
      lines.value.splice(0, lines.value.length)
      redoStack.value.splice(0, redoStack.value.length)
      clearTemp()
      clearMain()
    }

    const undoDrawing = () => {
      const line = lines.value.pop()
      if (line) {
        redoStack.value.push(line)
        clearMain()
        drawMainCanvas()
      }
    }

    const redoDrawing = () => {
      const line = redoStack.value.pop()
      if (line) {
        lines.value.push(line)
        clearMain()
        drawMainCanvas()
      }
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
