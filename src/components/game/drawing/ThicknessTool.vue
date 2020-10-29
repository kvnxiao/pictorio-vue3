<template>
  <div class="tool" :class="{ selected: isSelected }" @click="setThickness()">
    <div class="inner" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { THICKNESSES } from "@/models/drawing"
import { useGlobalDrawingState } from "@/game/drawingState"

export default defineComponent({
  name: "ThicknessTool",
  props: {
    thicknessIdx: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const { thicknessIdx } = useGlobalDrawingState()

    const thickness = computed(() => `${THICKNESSES[props.thicknessIdx]}px`)

    const setThickness = () => {
      thicknessIdx.value = props.thicknessIdx
    }

    const isSelected = computed(() => thicknessIdx.value === props.thicknessIdx)

    return {
      thickness,
      setThickness,
      isSelected,
    }
  },
})
</script>

<style lang="sass" scoped vars="{ thickness }">
.tool
  background: #FFFFFF

.inner
  border-radius: 50%
  width: var(--thickness)
  height: var(--thickness)
  background: #000000
</style>
