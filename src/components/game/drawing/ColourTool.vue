<template>
  <div class="tool" />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { COLOURS } from "@/game/drawing"

export default defineComponent({
  name: "ColourTool",
  props: { colourIdx: Number },
  setup(props) {
    const colour = computed(() => COLOURS[props.colourIdx ?? 1])
    return {
      colour,
    }
  },
})
</script>

<style lang="sass" scoped vars="{ colour }">
.tool
  background: var(--colour)
  border: 3px solid #FFFFFF
  display: flex
  justify-content: center
  align-items: center
  width: 30px
  height: 30px
  border-radius: 50%
  margin: 0 3px
</style>
