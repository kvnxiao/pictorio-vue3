<template>
  <div class="game">
    <div id="player-info" class="game-panel">
      <div class="wrapper">
        <player-info />
      </div>
    </div>

    <div id="center" ref="center" class="game-panel">
      <div class="wrapper">
        <div class="aspect-ratio">
          <template v-if="isGameStarted">
            <drawing :canvas-width="width" :canvas-height="height" :max-canvas-width="maxWidth" />
          </template>
          <template v-else>
            <waiting />
          </template>
        </div>
      </div>
    </div>

    <div id="chat" class="game-panel">
      <div class="wrapper">
        <chat />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Ref, computed, defineComponent, ref } from "vue"
import Chat from "@/components/game/Chat.vue"
import Drawing from "@/components/game/Drawing.vue"
import PlayerInfo from "@/components/game/PlayerInfo.vue"
import Waiting from "@/components/game/Waiting.vue"
import { useResizeObserver } from "@/composables/useResizeObserver"

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
    const center: Ref<HTMLDivElement | null> = ref(null)
    const maxWidth: Ref<number> = ref(1500)
    const { width, height } = useResizeObserver(center)

    const canvasHeight = computed(() => `${height.value}px`)
    const maxWidthPixels = computed(() => `${maxWidth.value}px`)

    return {
      isGameStarted,
      center,
      width,
      height,
      maxWidth,
      canvasHeight,
      maxWidthPixels,
    }
  },
})
</script>

<style lang="sass" scoped vars="{ canvasHeight, maxWidthPixels }">
.game
  display: flex
  width: 100%
  height: calc(100% - 52px)
  align-items: center
  justify-content: center

.wrapper
  border-radius: 10px
  background: white
  display: block
  position: relative
  width: 100%
  height: 100%
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02)

#center
  width: 70%
  max-width: var(--maxWidthPixels)

.aspect-ratio
  padding-top: (10 / 16) * 100%

#chat, #player-info
  width: 15%
  height: var(--canvasHeight)

.game-panel
  margin: 0.5rem
  &:first-of-type
    margin-left: 1rem
  &:last-of-type
    margin-right: 1rem
</style>
