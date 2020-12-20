<template>
  <div class="select-none p-4">
    <ul class="space-y-4">
      <li v-for="p of players" :key="p.id">
        <PlayerEntry :state="p" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { GameStatus } from "@/models/events"
import PlayerEntry from "@/components/game/player/PlayerEntry.vue"
import { PlayerState } from "@/models/playerState"
import { useGameStore } from "@/store/gameStore"
import { useUserStore } from "@/store/userStore"

export default defineComponent({
  name: "PlayersPanel",
  components: { PlayerEntry },
  setup() {
    const userStore = useUserStore()
    const gameStore = useGameStore()

    const players = computed<PlayerState[]>(() => {
      if (gameStore.state.gameStatus === GameStatus.Started) {
        return gameStore.state.playerOrderIds.map(
          (orderID: string) => userStore.state.playerStates[orderID],
        )
      } else {
        return Object.values(userStore.state.playerStates).filter(
          (state: PlayerState) => state.isConnected,
        )
      }
    })

    return {
      players,
    }
  },
})
</script>
