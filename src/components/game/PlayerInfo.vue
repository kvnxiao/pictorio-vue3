<template>
  <div id="info">
    <div class="box">
      <div class="filler">
        <ul>
          <li v-for="p of players" :key="p.name">
            <player-entry :name="p.name" :points="p.points" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { reactive, defineComponent } from "vue"
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
.filler
  li
    padding: 1rem
</style>
