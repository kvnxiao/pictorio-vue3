<template>
  <div class="select-none p-4">
    <ul class="space-y-4">
      <li v-for="player of players" :key="player.id">
        <PlayerEntry :player="player" :drawing-user-id="drawingUserId" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { GameStatus, TurnStatus } from "@/models/status"
import { PropType, computed, defineComponent } from "vue"
import PlayerEntry from "@/components/game/player/PlayerEntry.vue"
import { PlayerState } from "@/models/playerState"
import { User } from "@/models/user"
import { useGameStore } from "@/store/gameStore"
import { useUserStore } from "@/store/userStore"

export default defineComponent({
  name: "Players",
  components: {
    PlayerEntry,
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
  setup(props) {
    const userStore = useUserStore()
    const gameStore = useGameStore()

    const players = computed<PlayerState[]>(() => {
      if (props.status === GameStatus.STARTED) {
        return gameStore.state.playerOrderIds
          .map((orderID: string) => userStore.state.playerStates[orderID])
          .filter((state: PlayerState) => !state.isSpectator)
      } else {
        return Object.values(userStore.state.playerStates).filter(
          (state: PlayerState) => !state.isSpectator,
        )
      }
    })

    const drawingUserId = computed<string>(() => props.drawingUser?.id ?? "")

    return {
      players,
      drawingUserId,
    }
  },
})
</script>
