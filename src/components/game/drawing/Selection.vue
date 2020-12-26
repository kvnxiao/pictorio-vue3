<template>
  <!-- Overlay (absolute, full width and height) -->
  <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
    <div class="flex flex-col h-full items-center justify-center">
      <transition name="bounce-r" mode="out-in">
        <div
          v-if="showNextUp"
          class="bg-yellow-200 p-8 space-y-4 shadow-lg transform rotate-3 pointer-events-auto"
        >
          <p class="font-semibold text-xl text-yellow-900 select-none">
            Next up: {{ drawerName }}
          </p>
          <p
            v-if="isDrawerTurn"
            class="font-semibold text-xl text-yellow-900 select-none"
          >
            That means you!
          </p>
        </div>
        <div
          v-else-if="isDrawerTurn && showSelection && hasWordSelections"
          class="bg-yellow-200 p-8 space-y-4 shadow-lg transform rotate-3 pointer-events-auto"
        >
          <p class="font-semibold text-xl text-yellow-900 select-none">
            Choose your word to draw
          </p>
          <p v-for="(word, index) of wordSelections" :key="word">
            <button
              class="bg-yellow-100 p-1 rounded-md shadow-md uppercase font-semibold text-2xl text-gray-800 select-none"
              @click="selectWord(index)"
            >
              {{ word }}
            </button>
          </p>
        </div>
        <div
          v-else-if="!isDrawerTurn && showSelection"
          class="bg-yellow-200 p-8 space-y-4 shadow-lg transform rotate-3 pointer-events-auto"
        >
          <p class="font-semibold text-xl text-yellow-900 select-none">
            Waiting for {{ drawerName }} to pick a word
          </p>
        </div>
        <div
          v-else-if="showTurnEnd"
          class="bg-yellow-200 p-8 space-y-4 shadow-lg transform rotate-3 pointer-events-auto"
        >
          <p class="font-semibold text-xl text-yellow-900 select-none">
            The word was
            <span class="uppercase text-red-600"> {{ answer }} </span>&nbsp;!
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from "vue"
import { GameActions } from "@/store/gameStore/actions"
import { TurnStatus } from "@/models/status"
import { User } from "@/models/user"
import { useGameEvents } from "@/game/events"
import { useGameStore } from "@/store/gameStore"
import { useGlobalWebSocket } from "@/game/websocket"
import { useWords } from "@/composables/gameState/useWords"

export default defineComponent({
  name: "Selection",
  props: {
    selfUser: {
      type: Object as PropType<User>,
      required: true,
    },
    drawingUser: {
      type: Object as PropType<User | null>,
      required: false,
      default: null,
    },
    isDrawerTurn: {
      type: Boolean,
      default: false,
    },
    turnStatus: {
      type: Number as PropType<TurnStatus>,
      required: true,
    },
  },
  setup(props) {
    const { send } = useGlobalWebSocket()
    const { sendEvent } = useGameEvents(send)
    const gameStore = useGameStore()

    const { wordSelections } = useWords()
    const drawerName = computed<string>(() => props.drawingUser?.name ?? "")

    const hasWordSelections = computed<boolean>(() => wordSelections.value.length > 0)

    const showNextUp = computed<boolean>(
      () => props.turnStatus === TurnStatus.NEXT_PLAYER,
    )
    const showSelection = computed<boolean>(
      () => props.turnStatus === TurnStatus.SELECTION,
    )
    const showTurnEnd = computed<boolean>(() => props.turnStatus === TurnStatus.ENDED)

    const answer = computed<string>(() =>
      showTurnEnd.value ? gameStore.state.currentWord ?? "" : "",
    )

    const selectWord = async (index: number) => {
      gameStore.dispatch(GameActions.SELECT_WORD, {
        sendEvent,
        user: props.selfUser,
        index,
      })
    }

    return {
      drawerName,
      wordSelections,
      hasWordSelections,
      selectWord,
      showNextUp,
      showSelection,
      showTurnEnd,
      answer,
    }
  },
})
</script>
