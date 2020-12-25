<template>
  <Players
    :self-user="selfUser"
    :drawing-user="drawingUser"
    :status="status"
    :turn-status="turnStatus"
  />
</template>

<script lang="ts">
import { GameStatus, TurnStatus } from "@/models/status"
import { PropType, defineComponent } from "vue"
import Players from "@/components/game/panels/left/Players.vue"
import { User } from "@/models/user"

export default defineComponent({
  name: "PanelLeft",
  components: {
    Players,
  },
  props: {
    selfUser: {
      type: Object as PropType<User>,
      required: true,
    },
    drawingUser: {
      type: Object as PropType<User | null>,
      required: false,
      default: null,
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
