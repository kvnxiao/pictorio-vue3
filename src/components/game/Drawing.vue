<template>
  <div id="drawing">
    <canvas id="canvas" ref="canvas" />
    <canvas id="top-canvas" ref="topCanvas" />
    <toolbelt />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, Ref, ref, watch } from "vue"
import { MouseEventType, useDrawingCoordinates } from "@/game/useDrawingCoordinates"
import { Drawing, CanvasDrawing } from "@/game/drawing"
import { useDrawingState } from "@/game/drawingState"
import Toolbelt from "@/components/game/drawing/Toolbelt.vue"

export default defineComponent({
  name: "Drawing",
  components: { Toolbelt },
  props: {
    canvasWidth: Number,
    canvasHeight: Number,
    maxCanvasWidth: Number,
  },
  setup(props) {
    const canvas: Ref<HTMLCanvasElement | null> = ref(null)
    const topCanvas: Ref<HTMLCanvasElement | null> = ref(null)
    const { x, y, type, isTargetCanvas } = useDrawingCoordinates(topCanvas, canvas)
    const { drawingState } = useDrawingState()

    let drawing: Drawing | null = null

    // Resize the drawing canvas when center div is resized
    watch(
      () => [props.canvasWidth, props.canvasHeight],
      ([width, height]) => {
        if (width && height) {
          drawing?.resizeCanvas(width, height)
        }
      },
    )

    watch([x, y, type, isTargetCanvas], ([newX, newY, newType, newTargetted]) => {
      if (canvas.value && topCanvas.value) {
        const x = newX as number
        const y = newY as number
        const type = newType as MouseEventType
        const isTargetCanvas = newTargetted as boolean
        switch (type) {
          case MouseEventType.MOVE: {
            drawing?.onPencilMove(x, y)
            break
          }
          case MouseEventType.CLICK: {
            if (isTargetCanvas) {
              drawing?.onPencilDown(x, y)
            }
            break
          }
          case MouseEventType.RELEASE: {
            drawing?.onPencilUp(x, y)
            break
          }
        }
      }
    })

    onMounted(() => {
      if (canvas.value && topCanvas.value && props.maxCanvasWidth) {
        drawing = new CanvasDrawing(
          canvas.value,
          topCanvas.value,
          props.maxCanvasWidth,
          drawingState,
        )
      }
    })

    onUnmounted(() => {
      drawing?.destroy()
      drawing = null
    })

    return {
      canvas,
      topCanvas,
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
  background: white

#top-canvas
  pointer-events: none
</style>
