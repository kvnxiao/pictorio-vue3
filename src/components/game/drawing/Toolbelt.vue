<template>
  <div class="toolbelt">
    <div class="tools">
      <template v-for="(colour, index) of COLOURS" :key="colour">
        <ColourTool :colour-idx="index" />
      </template>
    </div>
    <div class="spacer" />
    <div class="tools">
      <template v-for="(thickness, index) of THICKNESSES" :key="thickness">
        <ThicknessTool :thickness-idx="index" />
      </template>
    </div>
    <div class="spacer" />
    <div class="tools">
      <ClearTool @tool-clear="$emit('tool-clear')" />
    </div>
  </div>
</template>

<script lang="ts">
import { COLOURS, THICKNESSES } from "@/models/drawing"
import ClearTool from "@/components/game/drawing/ClearTool.vue"
import ColourTool from "@/components/game/drawing/ColourTool.vue"
import ThicknessTool from "@/components/game/drawing/ThicknessTool.vue"
import { defineComponent } from "vue"

export default defineComponent({
  name: "Toolbelt",
  components: {
    ClearTool,
    ColourTool,
    ThicknessTool,
  },
  emits: ["tool-clear"],
  setup() {
    return {
      COLOURS,
      THICKNESSES,
    }
  },
})
</script>

<style lang="sass" scoped>
.toolbelt
  max-width: 880px
  display: flex
  justify-content: center
  margin: 0 auto
  position: relative
  bottom: 3.5rem

.tools
  display: flex
  background-color: #ECF0F0
  padding: 5px

.tools:first-of-type
  border-radius: 2rem 0 0 2rem

.tools:last-of-type
  border-radius: 0 2rem 2rem 0

.tool
  display: flex
  justify-content: center
  align-items: center
  width: 30px
  height: 30px
  border-radius: 50%
  margin: 0 3px
  transition: all 0.15s ease
  &:hover
    transform: translate(0, -2px)

.selected
  transform: translate(0, -2px)
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)

.spacer
  width: 0.5rem
  background-color: #ECF0F0
  &::before
    color: darken(#ECF0F0, 25%)
    content: "|"
    line-height: 40px
</style>
