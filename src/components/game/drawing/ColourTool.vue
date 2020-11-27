<template>
  <div class="tool" :class="{ selected: isSelected }" @click="setColour()" />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { COLOURS } from "@/models/drawing"
import { useGlobalDrawingState } from "@/game/drawingState"

export default defineComponent({
  name: "ColourTool",
  props: {
    colourIdx: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const { colourIdx } = useGlobalDrawingState()

    const colour = computed(() => COLOURS[props.colourIdx])

    const setColour = () => {
      colourIdx.value = props.colourIdx
    }

    const isSelected = computed(() => colourIdx.value === props.colourIdx)

    return {
      colour,
      setColour,
      isSelected,
    }
  },
})
</script>

<style lang="sass" scoped>
.tool
  background: v-bind("colour")
  border: 3px solid #FFFFFF
</style>
