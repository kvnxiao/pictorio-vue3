<template>
  <div class="tool icon" @click="$emit('tool-undo')">
    <fa icon="undo" type="fas" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "UndoTool",
  emits: ["tool-undo"],
})
</script>

<style lang="sass" scoped>
svg
  padding: 5px
</style>
