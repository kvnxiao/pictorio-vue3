<template>
  <div id="drawing">
    <canvas id="canvas" ref="canvasRef" />
    <canvas id="top-canvas" ref="topCanvasRef" />
    <toolbelt />
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, toRef, watch, watchEffect } from "vue"
import { InputCoordinates, InputEvent, useInputCoordinates } from "@/game/useInputCoordinates"
import { useDrawingState } from "@/game/drawingState"
import Toolbelt from "@/components/game/drawing/Toolbelt.vue"
import { useDualLayerCanvasContext } from "@/game/canvas"
import { scaledPoint } from "@/models/drawing"

export default defineComponent({
  name: "Drawing",
  components: { Toolbelt },
  props: {
    canvasWidth: Number,
    canvasHeight: Number,
    maxCanvasWidth: Number,
  },
  setup(props) {
    const canvasRef: Ref<HTMLCanvasElement | null> = ref(null)
    const topCanvasRef: Ref<HTMLCanvasElement | null> = ref(null)
    const coordinates: InputCoordinates = useInputCoordinates(topCanvasRef, canvasRef)
    const { drawingState, recentTwoPoints, getLine } = useDrawingState()
    const { drawTemp, drawMain, clearTemp, clearMain, resize } = useDualLayerCanvasContext(
      canvasRef,
      topCanvasRef,
    )

    // Resize watcher to redraw contents onto screen
    watch([toRef(props, "canvasWidth"), toRef(props, "canvasHeight")], ([width, height]) => {
      if (width && height && props.maxCanvasWidth) {
        const scale = width / props.maxCanvasWidth
        resize(width, height)
        clearTemp()
        clearMain()
        drawingState.scale = scale
        for (const line of drawingState.lines) {
          drawMain(line, scale)
        }
      }
    })

    function onPencilDown(x: number, y: number) {
      drawingState.isDrawing = true
      const scale = drawingState.scale
      const point = scaledPoint(x, y, scale)
      drawingState.points.push(point)
    }

    function onPencilMove(x: number, y: number) {
      if (drawingState.isDrawing) {
        const scale = drawingState.scale
        const point = scaledPoint(x, y, scale)
        drawingState.points.push(point)

        const [p1, p2] = recentTwoPoints()
        drawTemp(p1, p2, drawingState.scale, drawingState.colourIdx, drawingState.thicknessIdx)
      }
    }

    function onPencilUp(x: number, y: number) {
      if (drawingState.isDrawing) {
        drawingState.isDrawing = false
        // TODO: undo / redo functionality (clear the undo / redo stack)
        const scale = drawingState.scale
        const point = scaledPoint(x, y, scale)
        drawingState.points.push(point)

        // Draw line on main layer canvas, then add line to history
        const line = getLine()
        drawMain(line, scale)
        drawingState.lines.push(line)
        drawingState.points = []
        clearTemp()
      }
    }

    watchEffect(() => {
      switch (coordinates.eventType) {
        case InputEvent.MOVE: {
          onPencilMove(coordinates.x, coordinates.y)
          break
        }
        case InputEvent.CLICK: {
          if (coordinates.isTargetCanvas && coordinates.button === 0) {
            onPencilDown(coordinates.x, coordinates.y)
          }
          break
        }
        case InputEvent.RELEASE: {
          onPencilUp(coordinates.x, coordinates.y)
          break
        }
      }
    })

    return {
      canvasRef,
      topCanvasRef,
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
