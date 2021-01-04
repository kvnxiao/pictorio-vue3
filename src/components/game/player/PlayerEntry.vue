<template>
  <div
    class="flex rounded-lg shadow-sm p-1 xl:p2"
    :class="{
      'border-yellow-400': isDrawerTurn,
      'border-blue-400': showPointsAward && !isDrawerTurn,
      'border-green-400': isReady,
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
      <transition name="slide-show">
        <div
          v-if="hasChat && latestMsg !== null"
          class="hidden xl:block chat-msg absolute left-full z-20 bg-white px-2 p-1 rounded-lg border border-gray-600 whitespace-nowrap font-medium text-lg"
        >
          {{ latestMsg }}
        </div>
      </transition>
      <p class="w-full points">{{ player.points }} PTS</p>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent, ref, watch } from "vue"
import { ChatEventType } from "@/models/events"
import { PlayerState } from "@/models/playerState"
import { debounce } from "lodash"
import { useChatStore } from "@/store/chatStore"

export default defineComponent({
  name: "PlayerEntry",
  props: {
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
    const chatStore = useChatStore()

    const isDrawerTurn = computed<boolean>(
      () => props.drawingUserId === props.player.user.id,
    )
    const points = ref<number>(0)
    const character = computed<string>(() => props.player.user.name[0])
    const isDisconnected = computed<boolean>(() => !props.player.isConnected)
    const isReady = computed<boolean>(() => props.player.isReady)
    const showPointsAward = computed<boolean>(() => props.canAward && points.value > 0)
    const hasChat = ref<boolean>(false)
    const latestMsg = ref<string | null>(null)

    const hideMessage = () => {
      hasChat.value = false
      latestMsg.value = null
    }

    const debouncedHideMessage = debounce(hideMessage, 1500)

    watch(
      () => chatStore.state.messages.length,
      (len: number) => {
        if (len > 0) {
          const msg = chatStore.state.messages[len - 1]
          if (msg.type === ChatEventType.USER && msg.user.id === props.player.user.id) {
            hasChat.value = true
            latestMsg.value = msg.message
            debouncedHideMessage()
          }
        }
      },
    )

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
      points,
      isDisconnected,
      isReady,
      showPointsAward,
      latestMsg,
      hasChat,
    }
  },
})
</script>

<style lang="scss" scoped>
.chat-msg {
  transform-origin: left;
  &:before,
  &:after {
    position: absolute;
    content: "";
    top: 0.5em;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid transparent;
  }
  &:before {
    left: -9px;
    border-right-color: black;
  }

  &:after {
    left: -8px;
    border-right-color: white;
  }
}
</style>
