<template>
  <button
    class="flex justify-center items-center w-tool-sm h-tool-sm xl:w-tool xl:h-tool bg-white shadow-md rounded-full focus:outline-none ring ring-white transform active:ring-blue-200"
    :class="{
      'ring-blue-300': isSelected,
    }"
    @click="setThickness()"
  >
    <div class="rounded-full bg-black" :style="thicknessStyle" />
  </button>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from "vue"
import { THICKNESSES, Thickness } from "@/models/drawing"
import { GameActions } from "@/store/gameStore/actions"
import { User } from "@/models/user"
import { useGameEvents } from "@/game/events"
import { useGameStore } from "@/store/gameStore"
import { useGlobalWebSocket } from "@/game/websocket/useGlobalWebSocket"

export default defineComponent({
  name: "ThicknessTool",
  props: {
    selfUser: {
      type: Object as PropType<User>,
      required: true,
    },
    thicknessIdx: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const { send } = useGlobalWebSocket()
    const { sendEvent } = useGameEvents(send)

    const gameStore = useGameStore()

    const thickness = computed<string>(() => `${THICKNESSES[props.thicknessIdx]}px`)

    const thicknessStyle = computed(() => {
      return {
        width: `${(THICKNESSES[props.thicknessIdx] / Thickness.LARGE) * 100}%`,
        height: `${(THICKNESSES[props.thicknessIdx] / Thickness.LARGE) * 100}%`,
      }
    })

    const isSelected = computed<boolean>(
      () => gameStore.state.thicknessIndex === props.thicknessIdx,
    )

    const setThickness = async () => {
      await gameStore.dispatch(GameActions.SELECT_THICKNESS, {
        user: props.selfUser,
        thicknessIdx: props.thicknessIdx,
        sendEvent,
      })
    }

    return {
      thickness,
      thicknessStyle,
      setThickness,
      isSelected,
    }
  },
})
</script>
