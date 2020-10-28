<template>
  <div class="toolbelt">
    <div class="tools">
      <template v-for="(colour, index) of COLOURS" :key="colour">
        <colour-tool :colour-idx="index" @click="setColour(index)" />
      </template>
    </div>
    <div class="tools">
      <template v-for="(thickness, index) of THICKNESSES" :key="thickness">
        <thickness-tool :thickness-idx="index" @click="setThickness(index)" />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { COLOURS, THICKNESSES } from "@/models/drawing"
import ColourTool from "@/components/game/drawing/ColourTool.vue"
import ThicknessTool from "@/components/game/drawing/ThicknessTool.vue"
import { defineComponent } from "vue"
import { useGlobalDrawingState } from "@/game/drawingState"

export default defineComponent({
  name: "Toolbelt",
  components: {
    ColourTool,
    ThicknessTool,
  },
  setup() {
    const { colourIdx, thicknessIdx } = useGlobalDrawingState()

    const setColour = (index: number) => {
      colourIdx.value = index
    }

    const setThickness = (index: number) => {
      thicknessIdx.value = index
    }

    return {
      COLOURS,
      THICKNESSES,
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
