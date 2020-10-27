<template>
  <div id="drawing">
    <canvas id="canvas" ref="canvas" />
    <canvas id="top-canvas" ref="topCanvas" />
    <div class="toolbelts">
      <div class="toolbelt">
        <div class="toolbelt"></div>
        <div class="toolbelt"></div>
        <div class="toolbelt"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, Ref, ref, watch } from "vue"
import { MouseEventType, useDrawingCoordinates } from "@/game/useDrawingCoordinates"
import { Drawing, CanvasDrawing } from "@/game/drawing"

export default defineComponent({
  name: "Drawing",
  props: {
    canvasWidth: Number,
    canvasHeight: Number,
    maxCanvasWidth: Number,
  },
  setup(props) {
    const canvas: Ref<HTMLCanvasElement | null> = ref(null)
    const topCanvas: Ref<HTMLCanvasElement | null> = ref(null)
    const { x, y, type, isTargetCanvas } = useDrawingCoordinates(topCanvas, canvas)

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
        drawing = new CanvasDrawing(canvas.value, topCanvas.value, props.maxCanvasWidth)
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

.tool
  display: flex
  justify-content: center
  align-items: center
  width: 30px
  height: 30px
  border-radius: 50%
  margin: 0 3px

#draw
  display: flex
  justify-content: center
  align-items: center
  position: relative

.toolbelts
  max-width: 880px
  display: flex
  justify-content: space-evenly
  position: relative
  bottom: 3.5rem
  background-color: #ECF0F0
  margin: 0 auto
  padding: 5px
  border-radius: 3rem

.toolbelt
  display: flex

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
