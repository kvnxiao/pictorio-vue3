<template>
  <div class="toolbelt">
    <div class="tools">
      <template v-for="(colour, index) of COLOURS" :key="colour">
        <colour-tool :colourIdx="index" @click="setColour(index)" />
      </template>
    </div>
    <div class="tools">
      <template v-for="(thickness, index) of THICKNESS" :key="thickness">
        <thickness-tool :sizeIdx="index" @click="setThickness(index)" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { COLOURS, THICKNESS } from "@/game/drawing"
import { useDrawingState } from "@/game/drawingState"
import ColourTool from "@/components/game/drawing/ColourTool.vue"
import ThicknessTool from "@/components/game/drawing/ThicknessTool.vue"

export default defineComponent({
  name: "Toolbelt",
  components: {
    ColourTool,
    ThicknessTool,
  },
  setup() {
    const { drawingState } = useDrawingState()

    function setColour(colourIdx: number) {
      drawingState.colourIdx = colourIdx
    }

    function setThickness(sizeIdx: number) {
      drawingState.sizeIdx = sizeIdx
    }

    return {
      COLOURS,
      THICKNESS,
      setColour,
      setThickness,
    }
  },
})
</script>

<style lang="sass" scoped>
.toolbelt
  max-width: 880px
  display: flex
  justify-content: space-evenly
  margin: 0 auto

.tools
  display: flex
  justify-content: space-evenly
  position: relative
  bottom: 3.5rem
  background-color: #ECF0F0
  margin: 0 auto
  padding: 5px
  border-radius: 3rem
</style>
