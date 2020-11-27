<template>
  <div
    class="tool"
    :class="{ selected: isSelected }"
    :style="{ background: colour }"
    @click="setColour()"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { COLOURS } from "@/models/drawing"
import { MutationTypes } from "@/store/gameStore/mutations"
import { useGameState } from "@/store/gameStore"

export default defineComponent({
  name: "ColourTool",
  props: {
    colourIdx: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const gameState = useGameState()

    const colour = computed(() => COLOURS[props.colourIdx])

    const setColour = () => {
      gameState.commit(MutationTypes.SET_COLOUR_IDX, props.colourIdx)
    }

    const isSelected = computed(() => gameState.state.colourIdx === props.colourIdx)

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
  border: 3px solid #FFFFFF
</style>
