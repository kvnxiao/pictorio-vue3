<template>
  <div class="tool" @click="$emit('tool-clear')">
    <fa icon="trash" type="fas" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "ClearTool",
  emits: ["tool-clear"],
})
</script>

<style lang="sass" scoped>
.tool
  background: #FFFFFF
  svg
    padding: 5px
</style>
