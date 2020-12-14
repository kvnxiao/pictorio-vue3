<template>
  <div class="waiting">
    <div class="card">
      <div class="card-image">
        <img src="@/assets/logo.svg" alt="Pictorio Logo" />
      </div>
      <div class="card-content">
        <div class="content">Waiting for all players to be ready</div>
        <div class="subtitle">
          <p>{{ readyPlayerCount }} / {{ currPlayerCount }}</p>
          <p>(max {{ maxPlayers }} players)</p>
        </div>
        <button
          class="button"
          :class="{ 'is-info': !ready, 'is-warning': ready }"
          @click="readyToggle"
        >
          {{ readyText }}
        </button>
        <br />
        <button
          v-if="isRoomLeader"
          class="button is-primary"
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

<style lang="sass" scoped>
button
  margin-bottom: 0.5rem

.waiting
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  display: flex
  justify-content: center
  align-items: center

.box
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0

.card
  border-radius: 5px
  border: 1px solid #ECF0F0

.card-image
img
  padding: 2rem 2rem
</style>
