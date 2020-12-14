<template>
  <div class="tool" :class="{ selected: isSelected }" @click="setThickness()">
    <div class="inner" :style="{ width: thickness, height: thickness }" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { GameMutations } from "@/store/gameStore/mutations"
import { THICKNESSES } from "@/models/drawing"
import { useGameStore } from "@/store/gameStore"

export default defineComponent({
  name: "ThicknessTool",
  props: {
    thicknessIdx: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const gameState = useGameStore()

    const thickness = computed<string>(() => `${THICKNESSES[props.thicknessIdx]}px`)

    const isSelected = computed<boolean>(
      () => gameState.state.thicknessIdx === props.thicknessIdx,
    )

    const setThickness = () => {
      gameState.commit(GameMutations.SET_THICKNESS_IDX, props.thicknessIdx)
    }

    return {
      thickness,
      setThickness,
      isSelected,
    }
  },
})
</script>

<style lang="sass" scoped>
.tool
  background: #FFFFFF

.inner
  border-radius: 50%
  background: #000000
</style>
