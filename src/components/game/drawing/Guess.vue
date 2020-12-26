<template>
  <div class="absolute -top-8 w-full flex justify-center items-center">
    <div
      class="bg-yellow-200 p-4 space-y-1 shadow-md text-gray-800 font-semibold select-none transform -rotate-2"
    >
      <template v-if="isDrawerTurn">
        <p class="text-xl">You are drawing:</p>
        <p class="text-xl uppercase text-red-600">{{ word }}</p>
        <p class="">Writing out the word is cheating!</p>
      </template>
      <template v-else>
        <p class="text-xl">{{ drawerName }} is drawing:</p>
        <p class="text-xl text-red-600">
          hint:
          <span class="uppercase space-x-5">
            <span
              v-for="(word, index) of wordHint"
              :key="index"
              class="inline-block space-x-1.5"
            >
              <span
                v-for="(char, charIndex) of word"
                :key="charIndex"
                class="inline-block"
              >
                {{ char }}
              </span>
            </span>
          </span>
        </p>
        <p class="">Writing out the word is cheating!</p>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from "vue"
import { User } from "@/models/user"
import { useWords } from "@/composables/gameState/useWords"

export default defineComponent({
  name: "Guess",
  props: {
    drawingUser: {
      type: Object as PropType<User | null>,
      required: false,
      default: null,
    },
    isDrawerTurn: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { word, wordHint } = useWords()

    const drawerName = computed<string>(() => props.drawingUser?.name ?? "")

    return {
      drawerName,
      word,
      wordHint,
    }
  },
})
</script>
