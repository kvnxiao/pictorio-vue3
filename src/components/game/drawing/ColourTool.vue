<template>
  <button
    class="flex justify-center items-center w-tool-sm h-tool-sm xl:w-tool xl:h-tool bg-white shadow-md rounded-full focus:outline-none ring ring-white transform active:ring-blue-200"
    :class="{
      'ring-blue-300': isSelected,
    }"
    :style="{ background: colour }"
    @click="setColour()"
  />
</template>

<script lang="ts">
import { COLOURS, Colours } from "@/models/drawing"
import { PropType, computed, defineComponent } from "vue"
import { GameActions } from "@/store/gameStore/actions"
import { User } from "@/models/user"
import { useGameEvents } from "@/game/events"
import { useGameStore } from "@/store/gameStore"
import { useGlobalWebSocket } from "@/game/websocket/useGlobalWebSocket"

export default defineComponent({
  name: "ColourTool",
  props: {
    selfUser: {
      type: Object as PropType<User>,
      required: true,
    },
    colourIdx: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const { send } = useGlobalWebSocket()
    const { sendEvent } = useGameEvents(send)
    const gameStore = useGameStore()

    const colour = computed<Colours>(() => COLOURS[props.colourIdx])

    const isSelected = computed<boolean>(
      () => gameStore.state.colourIndex === props.colourIdx,
    )

    const setColour = async () => {
      await gameStore.dispatch(GameActions.SELECT_COLOUR, {
        user: props.selfUser,
        colourIdx: props.colourIdx,
        sendEvent,
      })
    }

    return {
      colour,
      setColour,
      isSelected,
    }
  },
})
</script>
