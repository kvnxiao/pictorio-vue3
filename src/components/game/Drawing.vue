<template>
  <div id="drawing">
    <canvas id="canvas" ref="canvasRef" />
    <canvas id="top-canvas" ref="topCanvasRef" />
    <Toolbelt @tool-clear="clearDrawing()" />
  </div>
</template>

<script lang="ts">
import { InputEvent, useInputCoordinates } from "@/game/useInputCoordinates"
import { Ref, defineComponent, ref, toRef, watch, watchEffect } from "vue"
import Toolbelt from "@/components/game/drawing/Toolbelt.vue"
import { scaledPoint } from "@/models/drawing"
import { useDualLayerCanvasContext } from "@/game/canvas"
import { useGlobalDrawingState } from "@/game/drawingState"

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
    const { x, y, button, eventType, isTargetCanvas } = useInputCoordinates(topCanvasRef, canvasRef)
    const {
      isDrawing,
      points,
      lines,
      scale,
      colourIdx,
      thicknessIdx,
      getLatestTwoPoints,
      getLatestLine,
    } = useGlobalDrawingState()
    const { drawTemp, drawMain, clearTemp, clearMain, resize } = useDualLayerCanvasContext(
      canvasRef,
      topCanvasRef,
    )

    // Resize watcher to redraw contents onto screen
    watch([toRef(props, "canvasWidth"), toRef(props, "canvasHeight")], ([width, height]) => {
      const newScale = width / props.maxCanvasWidth
      resize(width, height)
      clearTemp()
      clearMain()
      scale.value = newScale
      for (const line of lines.value) {
        drawMain(line, scale.value)
      }
    })

    function onPencilDown(x: number, y: number) {
      isDrawing.value = true
      const point = scaledPoint(x, y, scale.value)
      points.value.push(point)
    }

    function onPencilMove(x: number, y: number) {
      if (isDrawing.value) {
        const point = scaledPoint(x, y, scale.value)
        points.value.push(point)

        const [p1, p2] = getLatestTwoPoints()
        drawTemp(p1, p2, scale.value, colourIdx.value, thicknessIdx.value)
      }
    }

    function onPencilUp(x: number, y: number) {
      if (isDrawing.value) {
        isDrawing.value = false
        // TODO: undo / redo functionality (clear the undo / redo stack)
        const point = scaledPoint(x, y, scale.value)
        points.value.push(point)

        // Draw line on main layer canvas, then add line to history
        const line = getLatestLine()
        drawMain(line, scale.value)
        lines.value.push(line)
        points.value = []
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
      clearTemp()
      clearMain()
    }

    return {
      canvasRef,
      topCanvasRef,
      clearDrawing,
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
