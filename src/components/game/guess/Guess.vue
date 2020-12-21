<template>
  <div class="absolute -top-8 w-full flex justify-center items-center">
    <div
      class="bg-yellow-200 p-4 space-y-1 shadow-md text-gray-800 font-semibold select-none transform -rotate-2"
    >
      <template v-if="isMyTurn">
        <p class="text-xl">You are drawing:</p>
        <p class="text-xl uppercase text-red-600">{{ word }}</p>
        <p class="">Writing out the word is cheating!</p>
      </template>
      <template v-else>
        <p class="text-xl">{{ drawerName }} is drawing:</p>
        <p class="text-xl text-red-600">
          hint: <span class="uppercase">{{ wordHint }}</span>
        </p>
        <p class="">Writing out the word is cheating!</p>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from "vue"
import { User } from "@/models/user"
import { useGameStore } from "@/store/gameStore"
import { useUserStore } from "@/store/userStore"

const HINT_CHAR = "_ "
const HINT_SPACE = "   "

export default defineComponent({
  name: "Guess",
  props: {
    drawer: {
      type: Object as PropType<User | null>,
      required: true,
    },
  },
  setup(props) {
    const gameStore = useGameStore()

    const isMyTurn = computed<boolean>(
      () => props.drawer?.id === userStore.state.selfUser.id,
    )

    const drawerName = computed<string>(() => props.drawer?.name ?? "")

    const word = computed<string>(() => gameStore.state.currentWord ?? "")
    const wordHint = computed<string>(() =>
      gameStore.state.currentWordLength
        ? gameStore.state.currentWordLength
            .map((count: number) => HINT_CHAR.repeat(count))
            .join(HINT_SPACE)
        : "",
    )

    const userStore = useUserStore()

    return {
      isMyTurn,
      drawerName,
      word,
      wordHint,
    }
  },
})
</script>
