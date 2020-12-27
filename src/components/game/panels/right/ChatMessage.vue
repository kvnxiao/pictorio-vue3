<template>
  <span :class="messageStyles">
    <span v-if="hasUser" class="font-semibold">{{ message.user.name }}</span>
    <span>{{ msg }}</span>
  </span>
</template>

<script lang="ts">
import { ChatEvent, ChatEventType } from "@/models/events"
import { PropType, computed, defineComponent } from "vue"

const MESSAGE_KEY = "%m"
const USER_KEY = "%u"

export default defineComponent({
  name: "ChatMessage",
  props: {
    message: {
      type: Object as PropType<ChatEvent>,
      required: true,
    },
  },
  setup(props) {
    const hasUser = computed<boolean>(() => props.message.format.includes(USER_KEY))
    const msg = computed<string>(() =>
      props.message.format
        .replace(USER_KEY, "")
        .replace(MESSAGE_KEY, props.message.message),
    )

    const messageStyles = computed(() => {
      return {
        "font-semibold":
          props.message.type === ChatEventType.SYSTEM ||
          props.message.type === ChatEventType.JOIN ||
          props.message.type === ChatEventType.LEAVE ||
          props.message.type === ChatEventType.GUESSED,
        "text-blue-800": props.message.type === ChatEventType.JOIN,
        "text-red-800": props.message.type === ChatEventType.LEAVE,
        "text-yellow-800": props.message.type === ChatEventType.GUESSED,
      }
    })

    return {
      hasUser,
      msg,
      messageStyles,
    }
  },
})
</script>
