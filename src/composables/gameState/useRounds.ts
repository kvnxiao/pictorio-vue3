import { ComputedRef, computed } from "vue"
import { useGameStore } from "@/store/gameStore"

export interface RoundsState {
  rounds: ComputedRef<number>
  maxRounds: ComputedRef<number>
}

export function useRounds(): RoundsState {
  const gameStore = useGameStore()

  const rounds = computed<number>(() => gameStore.state.round)
  const maxRounds = computed<number>(() => gameStore.state.maxRounds)

  return {
    rounds,
    maxRounds,
  }
}
