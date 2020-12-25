<template>
  <Chat :self-user="selfUser" />
</template>

<script lang="ts">
import { GameStatus, TurnStatus } from "@/models/status"
import { PropType, defineComponent } from "vue"
import Chat from "@/components/game/panels/right/Chat.vue"
import { User } from "@/models/user"

export default defineComponent({
  name: "PanelRight",
  components: {
    Chat,
  },
  props: {
    selfUser: {
      type: Object as PropType<User>,
      required: true,
    },
    status: {
      type: Number as PropType<GameStatus>,
      required: true,
    },
    turnStatus: {
      type: Number as PropType<TurnStatus>,
      required: true,
    },
  },
})
</script>
