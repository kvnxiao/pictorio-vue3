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
import PlayerEntry from "@/components/game/player/PlayerEntry.vue"
import { PlayerState } from "@/models/playerState"
import { useUserStore } from "@/store/userStore"

export default defineComponent({
  name: "PlayersPanel",
  components: { PlayerEntry },
  setup() {
    const userStore = useUserStore()

    const players = computed<PlayerState[]>(() =>
      Object.values(userStore.state.playerStates).filter(
        (state: PlayerState) => state.isConnected,
      ),
    )

    return {
      players,
    }
  },
})
</script>
