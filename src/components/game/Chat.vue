<template>
  <div class="chatbox">
    <div class="conversation">
      <ul>
        <li v-for="(msg, index) in chatHistory" :key="index">
          <template v-if="msg.isSystem">
            {{ msg.message }}
          </template>
          <template v-else> {{ msg.user.name }}: {{ msg.message }} </template>
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
import {
  ChatEvent,
  EventType,
  UserJoinLeaveAction,
  UserJoinLeaveEvent,
} from "@/models/events"
import { ComputedRef, Ref, computed, defineComponent, ref } from "vue"
import { ChatMutations } from "@/store/chatStore/mutations"
import { UserMutations } from "@/store/userStore/mutations"
import { onEvent } from "@/game/events"
import { useChatStore } from "@/store/chatStore"
import { useGlobalWebSocket } from "@/game/websocket"
import { useUserStore } from "@/store/userStore"

export default defineComponent({
  name: "Chat",
  setup() {
    const chatStore = useChatStore()
    const userStore = useUserStore()
    const { sendEvent } = useGlobalWebSocket()
    const input: Ref<string> = ref("")

    const chatHistory: ComputedRef<ChatEvent[]> = computed(
      () => chatStore.state.messages,
    )

    onEvent(EventType.ChatEvent, (event: ChatEvent) => {
      console.log("Received ChatEvent from server!")
      chatStore.commit(ChatMutations.ADD_MESSAGE, {
        message: event.message,
        user: event.user,
        isSystem: event.isSystem,
      })
    })

    onEvent(EventType.UserJoinLeaveEvent, (event: UserJoinLeaveEvent) => {
      if (event.action === UserJoinLeaveAction.JOIN) {
        console.log("Received UserJoinLeaveEvent[Join] from server!")
        userStore.commit(UserMutations.USER_JOINED, event.playerState)
      } else {
        console.log("Received UserJoinLeaveEvent[Leave] from server!")
        userStore.commit(UserMutations.USER_LEFT, event.playerState)
      }
    })

    const sendMessage = () => {
      const chatEvent: ChatEvent = {
        user: userStore.state.selfUser,
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

  ul
    overflow-wrap: break-word

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
