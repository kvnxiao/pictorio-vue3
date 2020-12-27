<template>
  <template v-if="status === GameStatus.WAITING_READY_UP">
    <Waiting :self-user="selfUser" />
  </template>
  <template v-else-if="status === GameStatus.STARTED">
    <Drawing
      :self-user="selfUser"
      :drawing-user="drawingUser"
      :canvas-width="dynWidth"
      :canvas-height="dynHeight"
      :max-canvas-width="dynMaxWidth"
      :turn-status="turnStatus"
    />
  </template>
  <template v-else-if="status === GameStatus.GAME_OVER">
    <GameOver :self-user="selfUser" />
  </template>
</template>

<script lang="ts">
import { GameStatus, TurnStatus } from "@/models/status"
import { PropType, defineComponent, watch } from "vue"
import Drawing from "@/components/game/panels/center/Drawing.vue"
import GameOver from "@/components/game/panels/center/GameOver.vue"
import { PlayerState } from "@/models/playerState"
import { ToastMessageMutations } from "@/store/toastMsgStore/mutations"
import { User } from "@/models/user"
import Waiting from "@/components/game/panels/center/Waiting.vue"
import { useToastMsgStore } from "@/store/toastMsgStore"
import { useUserStore } from "@/store/userStore"

export default defineComponent({
  name: "PanelCenter",
  components: {
    Drawing,
    GameOver,
    Waiting,
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
    dynWidth: {
      type: Number,
      default: 0,
    },
    dynHeight: {
      type: Number,
      default: 0,
    },
    dynMaxWidth: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const userStore = useUserStore()
    const toastMsgStore = useToastMsgStore()

    watch(
      () => userStore.state.playerStates[props.selfUser.id],
      (p: PlayerState | undefined) => {
        if (p && p.isSpectator) {
          toastMsgStore.commit(ToastMessageMutations.SET, {
            message: "You've joined as a spectator!",
            type: "warning",
          })
        }
      },
    )

    return {
      GameStatus,
      TurnStatus,
    }
  },
})
</script>
