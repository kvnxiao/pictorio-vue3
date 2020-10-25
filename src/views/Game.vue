<template>
  <div id="game">
    <div class="grid">
      <player-info />
      <template v-if="isGameStarted">
        <drawing />
      </template>
      <template v-else>
        <waiting />
      </template>
      <chat />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue"
import Chat from "@/components/game/Chat.vue"
import Drawing from "@/components/game/Drawing.vue"
import Waiting from "@/components/game/Waiting.vue"
import PlayerInfo from "@/components/game/PlayerInfo.vue"

export default defineComponent({
  name: "Game",
  components: {
    Drawing,
    Waiting,
    PlayerInfo,
    Chat,
  },
  setup() {
    const isGameStarted: Ref<boolean> = ref(true)

    return {
      isGameStarted,
    }
  },
})
</script>

<style lang="sass">
#game
  display: flex
  width: 100%
  height: calc(100% - 52px)
  justify-content: center

  .grid
    width: 100%
    padding: 2rem
    margin: auto
    display: grid
    grid-template-columns: 15% auto 15%
    grid-column-gap: 1rem

  .box
    padding: 0.25rem
    width: 100%
    height: 100%
    background: #dadfdb
    box-shadow: 0 0.25em 0.5em rgba(10, 10, 10, 0.15), 0 0px 2px 1px rgba(10, 10, 10, 0.05)

  .filler
    border-radius: 3px
    background: white
    width: 100%
    height: 100%
</style>
