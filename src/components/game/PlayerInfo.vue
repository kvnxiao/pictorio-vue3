<template>
  <div class="info">
    <ul>
      <li v-for="p of players" :key="p.name">
        <player-entry :name="p.name" :points="p.points" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue"
import PlayerEntry from "@/components/game/player/PlayerEntry.vue"

interface Player {
  name: string
  points: number
}

export default defineComponent({
  name: "PlayerInfo",
  components: { PlayerEntry },
  setup() {
    const players: Player[] = reactive([{ name: "Kevin", points: 0 }])

    return {
      players,
    }
  },
})
</script>

<style lang="sass" scoped>
.info
  user-select: none
  li
    padding: 1rem
</style>
