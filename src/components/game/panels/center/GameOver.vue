<template>
  <!-- Overlay (absolute, full width and height) -->
  <div class="absolute top-0 left-0 w-full h-full">
    <div class="flex flex-col h-full items-center justify-center">
      <img class="block w-36 h-auto" src="@/assets/logo.svg" alt="Pictorio Logo" />
      <div class="mt-8 space-y-4">
        <div class="text-2xl">Game Over!</div>
        <p v-if="!isRoomLeader">Waiting for the room leader to start a new game.</p>
        <button
          v-if="isRoomLeader"
          class="w-30 flex-shrink-0 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200"
          @click="restartGame"
        >
          Play Again
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from "vue"
import { EventType } from "@/models/events"
import { User } from "@/models/user"
import { useGameEvents } from "@/game/events"
import { useGlobalWebSocket } from "@/game/websocket"
import { useUserStore } from "@/store/userStore"

export default defineComponent({
  name: "GameOver",
  props: {
    selfUser: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  setup(props) {
    const userStore = useUserStore()
    const { send } = useGlobalWebSocket()
    const { sendEvent } = useGameEvents(send)

    const isRoomLeader = computed<boolean>(
      () => userStore.state.playerStates[props.selfUser.id]?.isRoomLeader ?? false,
    )

    const restartGame = () => {
      sendEvent(EventType.NewGameIssued, {
        issuer: props.selfUser,
      })
    }

    return {
      isRoomLeader,
      restartGame,
    }
  },
})
</script>
