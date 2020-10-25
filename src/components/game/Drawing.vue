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
import { defineComponent, Ref, ref } from "vue"

export default defineComponent({
  name: "Drawing",
  setup() {
    const canvas: Ref<HTMLCanvasElement | null> = ref(null)
    const topCanvas: Ref<HTMLCanvasElement | null> = ref(null)

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
