<template>
  <div class="player-entry">
    <div class="colour">
      <div class="char">{{ character }}</div>
    </div>
    <div class="info">
      <p class="name">
        {{ state.isRoomLeader ? `${state.user.name}*` : state.user.name }}
      </p>
      <p class="points">{{ state.points }} PTS</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ComputedRef, PropType, computed, defineComponent } from "vue"
import { PlayerState } from "@/models/playerState"

export default defineComponent({
  name: "PlayerEntry",
  props: {
    state: {
      type: Object as PropType<PlayerState>,
      default: {
        user: {
          name: "",
          id: "",
        },
        points: 0,
        wins: 0,
        isSpectator: false,
        isConnected: false,
        isReady: false,
        isRoomLeader: false,
      },
    },
  },
  setup(props) {
    const character: ComputedRef<string> = computed(() => props.state.user.name[0])
    return {
      character,
    }
  },
})
</script>

<style lang="sass" scoped>
.player-entry
  display: flex
  border: 3px solid transparent
  border-radius: 5px

.colour
  pointer-events: none
  width: 3.5rem
  height: 3.5rem
  margin-right: 1rem

.char
  font-size: 2.5rem
  line-height: 3.5rem

.info
  height: 3rem
  .name
    font-size: 1.25rem
</style>
