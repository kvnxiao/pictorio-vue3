<template>
  <!-- Overlay (absolute, full width and height) -->
  <div class="absolute top-0 left-0 w-full h-full">
    <div class="flex flex-col h-full items-center justify-center">
      <img
        class="hidden xl:block w-36 h-auto"
        src="@/assets/logo.svg"
        alt="Pictorio Logo"
      />
      <div
        class="flex flex-col justify-center items-center space-y-2 xl:mt-8 xl:space-y-4"
      >
        <div class="font-semibold xl:font-normal xl:text-2xl">Game Over!</div>
        <div
          v-if="winners !== null && winners.length > 0"
          class="flex flex-col justify-center text-left h-12 overflow-y-scroll xl:h-auto xl:overflow-y-auto"
        >
          <p v-for="(winner, index) of winners" :key="winner.user.id">
            {{ index + 1 }}. {{ winner.user.name }} @ {{ winner.points }} PTS
          </p>
        </div>
        <p v-if="!isRoomLeader">Waiting for the room leader to start a new game.</p>
        <button
          v-if="isRoomLeader"
          class="flex-shrink-0 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200"
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
import { Winner } from "@/models/winner"
import { useGameEvents } from "@/game/events"
import { useGameStore } from "@/store/gameStore"
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
    const gameStore = useGameStore()
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

    const winners = computed<Winner[] | null>(() => gameStore.state.winners)

    return {
      isRoomLeader,
      restartGame,
      winners,
    }
  },
})
</script>
