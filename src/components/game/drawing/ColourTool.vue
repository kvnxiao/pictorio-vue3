<template>
  <div
    class="tool"
    :class="{ selected: isSelected }"
    :style="{ background: colour }"
    @click="setColour()"
  />
</template>

<script lang="ts">
import { COLOURS, Colours } from "@/models/drawing"
import { computed, defineComponent } from "vue"
import { GameMutations } from "@/store/gameStore/mutations"
import { useGameStore } from "@/store/gameStore"

export default defineComponent({
  name: "ColourTool",
  props: {
    colourIdx: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const gameState = useGameStore()

    const colour = computed<Colours>(() => COLOURS[props.colourIdx])

    const isSelected = computed<boolean>(
      () => gameState.state.colourIdx === props.colourIdx,
    )

    const setColour = () => {
      gameState.commit(GameMutations.SET_COLOUR_IDX, props.colourIdx)
    }

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
