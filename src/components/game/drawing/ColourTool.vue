<template>
  <button
    class="flex justify-center items-center w-tool h-tool bg-white shadow-md rounded-full focus:outline-none ring ring-white transform active:ring-blue-200"
    :class="{
      'ring-blue-300': isSelected,
    }"
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
    const gameStore = useGameStore()

    const colour = computed<Colours>(() => COLOURS[props.colourIdx])

    const isSelected = computed<boolean>(
      () => gameStore.state.colourIdx === props.colourIdx,
    )

    const setColour = () => {
      gameStore.commit(GameMutations.SET_COLOUR_IDX, props.colourIdx)
    }

    return {
      colour,
      setColour,
      isSelected,
    }
  },
})
</script>
