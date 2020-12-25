<template>
  <!-- Overlay (absolute, full width and height) -->
  <div class="absolute top-0 left-0 w-full h-full">
    <div class="flex flex-col h-full items-center justify-center">
      <transition name="bounce" mode="out-in">
        <div
          v-if="isNextUpState"
          class="bg-yellow-200 p-8 space-y-4 shadow-lg transform rotate-3"
        >
          <p class="font-semibold text-xl text-yellow-900 select-none">
            Next up: {{ drawerName }}
          </p>
        </div>
        <div
          v-else-if="isMyTurn && hasWordSelections"
          class="bg-yellow-200 p-8 space-y-4 shadow-lg transform rotate-3"
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
          v-else-if="!isMyTurn && !isNextUpState && drawerName !== ''"
          class="bg-yellow-200 p-8 space-y-4 shadow-lg transform rotate-3"
        >
          <p class="font-semibold text-xl text-yellow-900 select-none">
            Waiting for {{ drawerName }} to pick a word
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
import { useUserStore } from "@/store/userStore"

export default defineComponent({
  name: "Selection",
  props: {
    drawer: {
      type: Object as PropType<User | null>,
      default: null,
    },
  },
  setup(props) {
    const { send } = useGlobalWebSocket()
    const { sendEvent } = useGameEvents(send)
    const gameStore = useGameStore()
    const userStore = useUserStore()

    const drawerName = computed<string>(() => props.drawer?.name ?? "")

    const isNextUpState = computed<boolean>(
      () => gameStore.state.turnStatus == TurnStatus.NEXT_PLAYER,
    )

    const isMyTurn = computed<boolean>(
      () => props.drawer?.id === userStore.state.selfUser.id,
    )

    const wordSelections = computed<string[]>(
      () => gameStore.state.wordSelections ?? [],
    )

    const hasWordSelections = computed<boolean>(() => wordSelections.value.length > 0)

    const selectWord = async (index: number) => {
      gameStore.dispatch(GameActions.SELECT_WORD, {
        sendEvent,
        user: userStore.state.selfUser,
        index,
      })
    }

    return {
      drawerName,
      isMyTurn,
      isNextUpState,
      wordSelections,
      hasWordSelections,
      selectWord,
    }
  },
})
</script>

<style lang="scss" scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0) rotate(-3deg);
  }
  50% {
    transform: scale(1.25) rotate(7deg);
  }
  100% {
    transform: scale(1) rotate(3deg);
  }
}
</style>
