<template>
  <div class="chatbox">
    <div class="conversation">
      <ul>
        <li v-for="(msg, index) in chatHistory" :key="index">
          {{ msg.player.name }}: {{ msg.message }}
        </li>
      </ul>
    </div>

    <div class="chatbox-text field has-addons">
      <div id="chat-input" class="control">
        <input
          v-model="input"
          type="text"
          class="input"
          placeholder="Enter your guess"
          @keydown.enter="sendMessage"
        />
      </div>
      <div class="control">
        <button class="button" @click="sendMessage">
          <span class="icon">
            <fa icon="caret-right" type="fas" />
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ChatEvent, EventType } from "@/models/events"
import { Ref, defineComponent, ref } from "vue"
import { onEvent } from "@/game/events"
import { useGlobalWebSocket } from "@/game/useGlobalWebSocket"
import { usePlayerStore } from "@/store/playerStore"

export default defineComponent({
  name: "Chat",
  setup() {
    const playerStore = usePlayerStore()
    const { sendEvent } = useGlobalWebSocket()
    const input: Ref<string> = ref("")

    const chatHistory: Ref<ChatEvent[]> = ref([])

    onEvent(EventType.ChatEvent, (event: ChatEvent) => {
      chatHistory.value.push(event)
    })

    const sendMessage = () => {
      const chatEvent: ChatEvent = {
        player: playerStore.state.selfPlayer,
        message: input.value,
      }
      sendEvent(EventType.ChatEvent, chatEvent)
      // clear input
      input.value = ""
    }

    return {
      input,
      chatHistory,
      sendMessage,
    }
  },
})
</script>

<style lang="sass" scoped>
.chatbox
  padding: 1rem
  height: 100%
  display: flex
  flex-direction: column

.chatbox-text
  padding-top: 1rem

#chat-input
  user-select: none
  width: 100%

.conversation
  overflow-y: auto
  flex-grow: 1

  li
    text-align: left

  &
    scrollbar-width: thin

  &::-webkit-scrollbar
    width: 10px

  &::-webkit-scrollbar-track
    background: transparent

  &::-webkit-scrollbar-thumb
    background-color: #c2c2c2
    border-radius: 20px
</style>
