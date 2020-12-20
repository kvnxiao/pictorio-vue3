<template>
  <div
    class="flex rounded-lg shadow-sm p-2"
    :class="{
      'border-yellow-400': isCurrentTurn,
      'border-2': isCurrentTurn,
      border: !isCurrentTurn,
      'border-gray-200': !isCurrentTurn,
    }"
  >
    <div class="pointer-events-none mr-4 w-12 h-12 flex justify-center items-center">
      <div class="text-4xl">{{ character }}</div>
    </div>
    <div class="h-12">
      <p class="text-xl">
        {{ state.user.name }}
        <span v-if="state.isRoomLeader" class="inline-block">
          <svg
            class="w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        </span>
      </p>
      <p class="points">{{ state.points }} PTS</p>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from "vue"
import { PlayerState } from "@/models/playerState"
import { useGameStore } from "@/store/gameStore"

export default defineComponent({
  name: "PlayerEntry",
  props: {
    state: {
      type: Object as PropType<PlayerState>,
      default: {
        user: {
          name: "",
          id: "",
        },
        points: 0,
        wins: 0,
        isSpectator: false,
        isConnected: false,
        isReady: false,
        isRoomLeader: false,
      },
    },
  },
  setup(props) {
    const gameStore = useGameStore()

    const isCurrentTurn = computed<boolean>(
      () => gameStore.state.currentTurnUser?.id === props.state.user.id,
    )

    const character = computed<string>(() => props.state.user.name[0])
    return {
      character,
      isCurrentTurn,
    }
  },
})
</script>
