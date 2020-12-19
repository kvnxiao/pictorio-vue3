<template>
  <!-- Overlay (absolute, full width and height) -->
  <div class="absolute top-0 left-0 w-full h-full">
    <div class="flex flex-col h-full items-center justify-center">
      <img class="block w-36 h-auto" src="@/assets/logo.svg" alt="Pictorio Logo" />
      <div class="mt-8 space-y-4">
        <div class="text-2xl">Waiting for all players to be ready</div>
        <div class="text-base">
          <p>
            {{ readyPlayerCount }} / {{ currPlayerCount }} (max
            {{ maxPlayers }} players)
          </p>
        </div>
        <button
          class="w-24 flex-shrink-0 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
          :class="{
            'bg-blue-500': !ready,
            'hover:bg-blue-600': !ready,
            'active:bg-blue-700': !ready,
            'focus:ring-blue-500': !ready,
            'focus:ring-offset-blue-200': !ready,
            'bg-indigo-500': ready,
            'hover:bg-indigo-600': ready,
            'active:bg-indigo-700': ready,
            'focus:ring-indigo-500': ready,
            'focus:ring-offset-indigo-200': ready,
          }"
          @click="readyToggle"
        >
          {{ readyText }}
        </button>
        <br />
        <button
          v-if="isRoomLeader"
          class="w-24 flex-shrink-0 bg-green-500 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-green-200 disabled:opacity-50"
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
import { computed, defineComponent } from "vue"
import { EventType } from "@/models/events"
import { PlayerState } from "@/models/playerState"
import { useGameEvents } from "@/game/events"
import { useGameStore } from "@/store/gameStore"
import { useGlobalWebSocket } from "@/game/websocket"
import { useUserStore } from "@/store/userStore"

export default defineComponent({
  name: "Waiting",
  setup() {
    const gameStore = useGameStore()
    const userStore = useUserStore()
    const { send } = useGlobalWebSocket()
    const { sendEvent } = useGameEvents(send)

    const maxPlayers = computed<number>(() => gameStore.state.maxPlayers)

    const currPlayerCount = computed<number>(
      () =>
        Object.values(userStore.state.playerStates).filter(
          (playerState: PlayerState) => playerState.isConnected,
        ).length,
    )

    const ready = computed<boolean>(
      () => userStore.state.playerStates[userStore.state.selfUser.id]?.isReady ?? false,
    )

    const readyPlayerCount = computed<number>(() => {
      return Object.values(userStore.state.playerStates).filter(
        (playerState: PlayerState) => playerState.isConnected && playerState.isReady,
      ).length
    })

    const readyText = computed<string>(() => (ready.value ? "Unready" : "Ready"))

    const startDisabled = computed<boolean>(
      () =>
        readyPlayerCount.value < currPlayerCount.value || readyPlayerCount.value <= 1,
    )

    const isRoomLeader = computed<boolean>(
      () =>
        userStore.state.playerStates[userStore.state.selfUser.id]?.isRoomLeader ??
        false,
    )

    const readyToggle = () => {
      sendEvent(EventType.ReadyEvent, {
        user: userStore.state.selfUser,
        ready: !ready.value,
      })
    }

    const startGame = () => {
      sendEvent(EventType.StartGameIssuedEvent, {
        issuer: userStore.state.selfUser,
      })
    }

    return {
      currPlayerCount,
      maxPlayers,
      ready,
      readyPlayerCount,
      readyText,
      readyToggle,
      startGame,
      startDisabled,
      isRoomLeader,
    }
  },
})
</script>
