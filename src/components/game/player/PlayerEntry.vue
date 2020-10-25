<template>
  <div class="player-entry">
    <div class="colour">
      <div class="char">{{ character }}</div>
    </div>
    <div class="info">
      <p class="name">{{ name }}</p>
      <p class="points">{{ points }} PTS</p>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue"

export default defineComponent({
  name: "PlayerEntry",
  props: {
    name: String,
    points: Number,
  },
  setup(props) {
    const character: ComputedRef<string> = computed(() => props.name?.[0] ?? "")
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
