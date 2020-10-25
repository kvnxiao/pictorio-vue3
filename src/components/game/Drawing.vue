<template>
  <div class="drawing">
    <div class="wrapper">
      <div class="box">
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

.wrapper
  display: block
  position: relative
  width: 100%
  padding-top: (10 / 16) * 100%
  .box
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0

  #canvas
    border-radius: 3px
    background: white
    width: 100%
    height: 100%

  #top-canvas
    position: absolute
    left: 0
    top: 0
    padding: 0.25rem
    pointer-events: none
</style>
