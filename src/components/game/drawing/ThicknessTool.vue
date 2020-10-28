<template>
  <div class="tool">
    <div class="inner" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue"
import { THICKNESS_MULTIPLIER } from "@/game/drawing"

export default defineComponent({
  name: "ThicknessTool",
  props: { sizeIdx: Number },
  setup(props) {
    const thickness = computed(() => `${((props.sizeIdx ?? 0) + 1) * THICKNESS_MULTIPLIER}px`)
    return {
      thickness,
    }
  },
})
</script>

<style lang="sass" scoped vars="{ thickness }">
.tool
  background: #FFFFFF
  display: flex
  justify-content: center
  align-items: center
  width: 30px
  height: 30px
  border-radius: 50%
  margin: 0 3px

.inner
  border-radius: 50%
  width: var(--thickness)
  height: var(--thickness)
  background: #000000
</style>
