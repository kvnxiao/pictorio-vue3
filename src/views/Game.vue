<template>
  <Suspense>
    <template #default>
      <Room />
    </template>
    <template #fallback>
      <div class="flex w-full h-full items-center justify-center">
        <p class="bg-white py-6 px-10 shadow-md rounded-md text-xl text-gray-700">
          Loading...
        </p>
      </div>
    </template>
  </Suspense>
</template>

<script lang="ts">
import Room from "@/components/game/Room.vue"
import { defineComponent } from "vue"

export default defineComponent({
  name: "Game",
  components: {
    Room,
  },
})
</script>
