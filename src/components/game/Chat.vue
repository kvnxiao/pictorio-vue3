<template>
  <div id="chat">
    <div class="box">
      <div class="filler">
        <div class="conversation">
          <ul>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
          </ul>
        </div>

        <div class="chatbox field has-addons">
          <div class="control" id="chat-input">
            <input type="text" class="input" placeholder="Enter your guess" />
          </div>
          <div class="control">
            <button class="button">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "Chat",
})
</script>

<style lang="sass" scoped>
#chat
  .filler
    display: flex
    flex-direction: column

  #chat-input
    width: 100%

.conversation
  overflow-y: scroll
  flex-grow: 1
  li
    text-align: left
    padding: 0 0.25rem
</style>
