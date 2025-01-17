<template>
  <div class="flex h-full p-2 flex-col-reverse xl:flex-col xl:p-4">
    <div class="select-none flex-grow h-0 overflow-y-auto scrollbar">
      <ul class="space-y-1.5 xl:space-y-4">
        <li v-for="player of players" :key="player.id">
          <PlayerEntry
            :player="player"
            :drawing-user-id="drawingUserId"
            :can-award="canAwardPoints"
          />
        </li>
      </ul>
    </div>
    <div class="border-b mb-2.5 xl:border-b-0 xl:mb-0 xl:pt-2 xl:border-t xl:mt-2">
      {{ subText }}
    </div>
  </div>
</template>

<script lang="ts">
import { GameStatus, TurnStatus } from "@/models/status"
import { PropType, computed, defineComponent } from "vue"
import PlayerEntry from "@/components/game/player/PlayerEntry.vue"
import { PlayerState } from "@/models/playerState"
import { User } from "@/models/user"
import { useGameStore } from "@/store/gameStore"
import { useRounds } from "@/composables/gameState/useRounds"
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
    const { rounds, maxRounds } = useRounds()

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

    const subText = computed<string>(() => {
      return props.status === GameStatus.STARTED
        ? `Round: ${rounds.value + 1} / ${maxRounds.value}`
        : "Waiting..."
    })

    const canAwardPoints = computed<boolean>(
      () =>
        props.turnStatus === TurnStatus.DRAWING ||
        props.turnStatus === TurnStatus.ENDED,
    )

    return {
      players,
      drawingUserId,
      rounds,
      maxRounds,
      GameStatus,
      subText,
      canAwardPoints,
    }
  },
})
</script>
