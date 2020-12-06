<template>
  <div class="chatbox">
    <div class="conversation">
      <ul>
        <li v-for="(msg, index) in chatHistory" :key="index">
          <template v-if="msg.type === MessageType.PlayerJoin">
            {{ msg.player.name }} has joined the room
          </template>
          <template v-else-if="msg.type === MessageType.PlayerLeave">
            {{ msg.player.name }} has joined the room
          </template>
          <template v-else-if="msg.type === MessageType.PlayerText">
            {{ msg.player.name }}: {{ msg.message }}
          </template>
          <template v-else>{{ msg.message }}</template>
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
  PlayerJoinLeaveAction,
  PlayerJoinLeaveEvent,
} from "@/models/events"
import { ChatMessage, MessageType } from "@/store/chatStore/state"
import { ComputedRef, Ref, computed, defineComponent, ref } from "vue"
import { ChatMutations } from "@/store/chatStore/mutations"
import { PlayerMutations } from "@/store/playerStore/mutations"
import { onEvent } from "@/game/events"
import { useChatStore } from "@/store/chatStore"
import { useGlobalWebSocket } from "@/game/websocket"
import { usePlayerStore } from "@/store/playerStore"

export default defineComponent({
  name: "Chat",
  setup() {
    const chatStore = useChatStore()
    const playerStore = usePlayerStore()
    const { sendEvent } = useGlobalWebSocket()
    const input: Ref<string> = ref("")

    const chatHistory: ComputedRef<ChatMessage[]> = computed(
      () => chatStore.state.messages,
    )

    onEvent(EventType.ChatEvent, (event: ChatEvent) => {
      chatStore.commit(ChatMutations.ADD_MESSAGE, {
        message: event.message,
        player: event.player,
        isSystem: false,
        type: MessageType.PlayerText,
      })
    })

    onEvent(EventType.PlayerJoinLeaveEvent, (event: PlayerJoinLeaveEvent) => {
      if (event.action === PlayerJoinLeaveAction.JOIN) {
        playerStore.commit(PlayerMutations.PLAYER_JOINED, event.player)
        chatStore.commit(ChatMutations.ADD_MESSAGE, {
          message: "",
          player: event.player,
          isSystem: true,
          type: MessageType.PlayerJoin,
        })
      } else {
        playerStore.commit(PlayerMutations.PLAYER_LEFT, event.player)
        chatStore.commit(ChatMutations.ADD_MESSAGE, {
          message: "",
          player: event.player,
          isSystem: true,
          type: MessageType.PlayerLeave,
        })
      }
    })

    function sendMessage(): void {
      const chatEvent: ChatEvent = {
        player: playerStore.state.selfPlayer,
        message: input.value,
      }
      console.log(playerStore.state.selfPlayer.name)
      sendEvent(EventType.ChatEvent, chatEvent)
      // clear input
      input.value = ""
    }

    return {
      input,
      chatHistory,
      sendMessage,
      MessageType,
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
