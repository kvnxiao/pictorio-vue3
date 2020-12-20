<template>
  <button
    class="flex justify-center items-center w-tool h-tool bg-white shadow-md rounded-full focus:outline-none ring ring-white transform active:ring-blue-200"
    @click="$emit('tool-undo')"
  >
    <svg
      class="w-6 h-6 text-gray-800"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
      />
    </svg>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "UndoTool",
  emits: ["tool-undo"],
})
</script>
