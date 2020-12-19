<template>
  <button
    class="flex justify-center items-center w-tool h-tool bg-white rounded-full focus:outline-none ring ring-white transform active:ring-blue-200"
    :class="{
      'ring-blue-300': isSelected,
    }"
    @click="setThickness()"
  >
    <div
      class="rounded-full bg-black"
      :style="{ width: thickness, height: thickness }"
    />
  </button>
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
    const gameStore = useGameStore()

    const thickness = computed<string>(() => `${THICKNESSES[props.thicknessIdx]}px`)

    const isSelected = computed<boolean>(
      () => gameStore.state.thicknessIdx === props.thicknessIdx,
    )

    const setThickness = () => {
      gameStore.commit(GameMutations.SET_THICKNESS_IDX, props.thicknessIdx)
    }

    return {
      thickness,
      setThickness,
      isSelected,
    }
  },
})
</script>
