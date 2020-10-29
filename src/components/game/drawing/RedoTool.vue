<template>
  <div class="tool icon" @click="$emit('tool-redo')">
    <fa icon="redo" type="fas" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "RedoTool",
  emits: ["tool-redo"],
})
</script>

<style lang="sass" scoped>
svg
  padding: 5px
</style>
