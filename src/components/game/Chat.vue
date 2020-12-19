<template>
  <div class="p-4 h-full flex flex-col space-y-4">
    <div ref="convoRef" class="scrollbar overflow-y-auto flex-grow">
      <ul class="break-words">
        <li v-for="(msg, index) in chatHistory" :key="index" class="text-left">
          <template v-if="msg.isSystem">
            {{ msg.message }}
          </template>
          <template v-else> {{ msg.user.name }}: {{ msg.message }} </template>
        </li>
      </ul>
    </div>

    <div class="flex w-full h-10 shadow-sm">
      <input
        v-model="input"
        type="text"
        class="select-none h-full flex-grow px-4 border-gray-300 rounded-l-md focus:ring-yellow-500 focus:border-yellow-400"
        placeholder="Enter your guess"
        @keydown.enter="sendMessage"
      />
      <button
        class="text-black h-full w-10 border-r border-t border-b border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
        @click="sendMessage"
      >
        <svg
          class="h-8 w-8 m-auto"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { ChatEvent, EventType } from "@/models/events"
import { computed, defineComponent, nextTick, ref, watch } from "vue"
import { useChatStore } from "@/store/chatStore"
import { useGameEvents } from "@/game/events"
import { useGlobalWebSocket } from "@/game/websocket"
import { useUserStore } from "@/store/userStore"

export default defineComponent({
  name: "Chat",
  setup() {
    const chatStore = useChatStore()
    const userStore = useUserStore()
    const { send } = useGlobalWebSocket()
    const { sendEvent } = useGameEvents(send)
    const input = ref<string>("")
    const convoRef = ref<HTMLDivElement | null>(null)

    const chatHistory = computed<ChatEvent[]>(() => chatStore.state.messages)

    const sendMessage = () => {
      if (input.value.length > 0) {
        const chatEvent: ChatEvent = {
          user: userStore.state.selfUser,
          message: input.value,
        }
        sendEvent(EventType.ChatEvent, chatEvent)
        // clear input
        input.value = ""
      }
    }

    // Always scroll chat to the bottom when new messages arrive
    watch(
      () => chatHistory.value.length,
      async () => {
        await nextTick() // wait for new message to render and update scroll height
        convoRef.value?.scroll({ top: convoRef.value?.scrollHeight + 100 })
      },
    )

    return {
      input,
      chatHistory,
      sendMessage,
      convoRef,
    }
  },
})
</script>
