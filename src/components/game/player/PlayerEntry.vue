<template>
  <div
    class="flex rounded-lg shadow-sm p-2"
    :class="{
      'border-yellow-400': isDrawerTurn,
      'border-blue-400': showPointsAward && !isDrawerTurn,
      'border-2': isDrawerTurn || showPointsAward,
      border: !isDrawerTurn && !showPointsAward,
      'border-gray-200': !isDrawerTurn,
      'opacity-30': isDisconnected,
    }"
  >
    <div class="pointer-events-none mr-1 w-12 h-12 flex justify-center items-center">
      <div class="text-4xl">{{ character }}</div>
    </div>
    <div class="h-12 text-left flex flex-col items-center justify-center">
      <div class="text-lg">
        <p>
          {{ player.user.name }}
          <span v-if="player.isRoomLeader" class="inline-block">
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
      </div>
      <transition name="bounce-l">
        <div
          v-if="showPointsAward"
          class="absolute right-7 rounded-md px-2.5 py-1.5 z-10 border opacity-95 font-semibold"
          :class="{
            'border-yellow-400': isDrawerTurn,
            'bg-yellow-50': isDrawerTurn,
            'border-blue-400': !isDrawerTurn,
            'bg-blue-50': !isDrawerTurn,
          }"
        >
          + {{ points }}
        </div>
      </transition>
      <p class="w-full points">{{ player.points }} PTS</p>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent, ref, watch } from "vue"
import { PlayerState } from "@/models/playerState"
import { User } from "@/models/user"

export default defineComponent({
  name: "PlayerEntry",
  props: {
    selfUser: {
      type: Object as PropType<User>,
      required: true,
    },
    player: {
      type: Object as PropType<PlayerState>,
      required: true,
    },
    drawingUserId: {
      type: String,
      required: true,
    },
    canAward: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const isDrawerTurn = computed<boolean>(
      () => props.drawingUserId === props.player.user.id,
    )
    const isSelfUser = computed<boolean>(
      () => props.selfUser.id === props.player.user.id,
    )
    const points = ref<number>(0)

    const character = computed<string>(() => props.player.user.name[0])

    const isDisconnected = computed<boolean>(() => !props.player.isConnected)

    const showPointsAward = computed<boolean>(() => props.canAward && points.value > 0)

    watch(
      () => props.player.points,
      (currPts: number, oldPts: number) => {
        points.value = currPts - oldPts
      },
    )

    watch(
      () => props.canAward,
      (val: boolean) => {
        if (!val) {
          points.value = 0
        }
      },
    )

    return {
      character,
      isDrawerTurn,
      isSelfUser,
      points,
      isDisconnected,
      showPointsAward,
    }
  },
})
</script>
