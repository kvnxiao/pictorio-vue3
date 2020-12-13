<template>
  <div class="waiting">
    <div class="card">
      <div class="card-image">
        <img src="@/assets/logo.svg" alt="Pictorio Logo" />
      </div>
      <div class="card-content">
        <div class="content">Waiting for all players to be ready</div>
        <div class="subtitle">{{ readyPlayers }} / {{ maxPlayers }}</div>
        <button
          class="button is-medium"
          :class="{ 'is-info': !ready, 'is-warning': ready }"
          @click="readyToggle"
        >
          {{ readyText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ComputedRef, computed, defineComponent } from "vue"
import { EventType } from "@/models/events"
import { PlayerState } from "@/models/playerState"
import { useGameStore } from "@/store/gameStore"
import { useGlobalWebSocket } from "@/game/websocket"
import { useUserStore } from "@/store/userStore"

export default defineComponent({
  name: "Waiting",
  setup() {
    const gameStore = useGameStore()
    const userStore = useUserStore()
    const { sendEvent } = useGlobalWebSocket()

    const maxPlayers: ComputedRef<number> = computed(() => gameStore.state.maxPlayers)

    const ready: ComputedRef<boolean> = computed(
      () => userStore.state.playerStates[userStore.state.selfUser.id]?.isReady ?? false,
    )

    const readyPlayers: ComputedRef<number> = computed(() => {
      return Object.values(userStore.state.playerStates).filter(
        (playerState: PlayerState) => playerState.isConnected && playerState.isReady,
      ).length
    })

    const readyText = computed(() => (ready.value ? "Unready" : "Ready"))

    const readyToggle = () => {
      sendEvent(EventType.ReadyEvent, {
        user: userStore.state.selfUser,
        ready: !ready.value,
      })
    }

    return {
      maxPlayers,
      ready,
      readyPlayers,
      readyText,
      readyToggle,
    }
  },
})
</script>

<style lang="sass" scoped>
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
