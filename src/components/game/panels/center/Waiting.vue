<template>
  <!-- Overlay (absolute, full width and height) -->
  <div class="absolute top-0 left-0 w-full h-full">
    <div class="flex flex-col h-full items-center justify-center">
      <img
        class="hidden xl:block w-36 h-auto"
        src="@/assets/logo.svg"
        alt="Pictorio Logo"
      />
      <div class="xl:mt-8 space-y-1 xl:space-y-4">
        <div class="font-semibold xl:font-normal xl:text-2xl">
          Waiting for all players to be ready
        </div>
        <div class="text-base">
          <p>
            {{ readyPlayerCount }} / {{ currPlayerCount }} (max
            {{ maxPlayers }} players)
          </p>
        </div>
        <button
          class="w-24 flex-shrink-0 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          :class="readyButtonStyles"
          @click="readyToggle"
        >
          {{ readyText }}
        </button>
        <br />
        <button
          v-if="isRoomLeader"
          class="w-24 flex-shrink-0 bg-green-500 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-green-200 disabled:opacity-30"
          :class="{
            'hover:bg-green-600': !startDisabled,
            'active:bg-green-700': !startDisabled,
          }"
          :disabled="startDisabled"
          @click="startGame"
        >
          Start
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from "vue"
import { EventType } from "@/models/events"
import { PlayerState } from "@/models/playerState"
import { User } from "@/models/user"
import { useGameEvents } from "@/game/events"
import { useGameStore } from "@/store/gameStore"
import { useGlobalWebSocket } from "@/game/websocket"
import { useUserStore } from "@/store/userStore"

export default defineComponent({
  name: "Waiting",
  props: {
    selfUser: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  setup(props) {
    const gameStore = useGameStore()
    const userStore = useUserStore()
    const { send } = useGlobalWebSocket()
    const { sendEvent } = useGameEvents(send)

    const maxPlayers = computed<number>(() => gameStore.state.maxPlayers)

    const currPlayerCount = computed<number>(
      () =>
        Object.values(userStore.state.playerStates).filter(
          (playerState: PlayerState) =>
            playerState.isConnected && !playerState.isSpectator,
        ).length,
    )

    const isReady = computed<boolean>(
      () => userStore.state.playerStates[props.selfUser.id]?.isReady ?? false,
    )

    const readyPlayerCount = computed<number>(() => {
      return Object.values(userStore.state.playerStates).filter(
        (playerState: PlayerState) => playerState.isConnected && playerState.isReady,
      ).length
    })

    const readyText = computed<string>(() => (isReady.value ? "Unready" : "Ready"))

    const startDisabled = computed<boolean>(
      () =>
        readyPlayerCount.value < currPlayerCount.value || readyPlayerCount.value <= 1,
    )

    const isRoomLeader = computed<boolean>(
      () => userStore.state.playerStates[props.selfUser.id]?.isRoomLeader ?? false,
    )

    const readyToggle = () => {
      sendEvent(EventType.Ready, {
        user: props.selfUser,
        ready: !isReady.value,
      })
    }

    const startGame = () => {
      sendEvent(EventType.StartGameIssued, {
        issuer: props.selfUser,
      })
    }

    const readyButtonStyles = computed(() => {
      const ready = isReady.value
      return {
        // Colour to un-ready
        "bg-indigo-500": ready,
        "hover:bg-indigo-600": ready,
        "active:bg-indigo-700": ready,
        "focus:ring-indigo-500": ready,
        "focus:ring-offset-indigo-200": ready,
        // Colour to ready up
        "bg-blue-500": !ready,
        "hover:bg-blue-600": !ready,
        "active:bg-blue-700": !ready,
        "focus:ring-blue-500": !ready,
        "focus:ring-offset-blue-200": !ready,
      }
    })

    return {
      currPlayerCount,
      maxPlayers,
      readyPlayerCount,
      readyText,
      readyToggle,
      startGame,
      startDisabled,
      isRoomLeader,
      // Style objects
      readyButtonStyles,
    }
  },
})
</script>
