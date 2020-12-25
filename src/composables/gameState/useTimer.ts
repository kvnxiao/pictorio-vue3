import { ComputedRef, Ref, computed } from "vue"
import { TurnStatus } from "@/models/status"
import { useGameStore } from "@/store/gameStore"

export interface TimerState {
  maxTime: ComputedRef<number>
  timeLeft: ComputedRef<number>
}

export function useTimer(turnStatus: Ref<TurnStatus>): TimerState {
  const gameStore = useGameStore()

  const maxTime = computed<number>(() => {
    switch (turnStatus.value) {
      case TurnStatus.NEXT_PLAYER:
        return gameStore.state.maxNextUpTime
      case TurnStatus.SELECTION:
        return gameStore.state.maxSelectionTime
      case TurnStatus.DRAWING:
        return gameStore.state.maxDrawingTime
      case TurnStatus.ENDED:
        return gameStore.state.maxEndTime
      default:
        return 0
    }
  })

  const timeLeft = computed<number>(() => gameStore.state.timeLeftSeconds)

  return {
    maxTime,
    timeLeft,
  }
}
