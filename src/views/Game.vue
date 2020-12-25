<template>
  <Suspense>
    <template #default>
      <GameLayout />
    </template>
    <template #fallback>
      <GameLayoutSkeleton />
    </template>
  </Suspense>
</template>

<script lang="ts">
import GameLayout from "@/components/game/GameLayout.vue"
import GameLayoutSkeleton from "@/components/game/GameLayoutSkeleton.vue"
import { defineComponent } from "vue"

export default defineComponent({
  name: "Game",
  components: {
    GameLayout,
    GameLayoutSkeleton,
  },
})
</script>
