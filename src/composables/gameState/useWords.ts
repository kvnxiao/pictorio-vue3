import { ComputedRef, computed } from "vue"
import { useGameStore } from "@/store/gameStore"

const HINT_CHAR = "_ "
const HINT_SPACE = "   "

export interface WordsState {
  word: ComputedRef<string>
  wordHint: ComputedRef<string>
  wordSelections: ComputedRef<string[]>
}

export function useWords(): WordsState {
  const gameStore = useGameStore()

  const word = computed<string>(() => gameStore.state.currentWord ?? "")
  const wordHint = computed<string>(() =>
    gameStore.state.currentWordLength
      ? gameStore.state.currentWordLength
          .map((count: number) => HINT_CHAR.repeat(count))
          .join(HINT_SPACE)
      : "",
  )
  const wordSelections = computed<string[]>(() => gameStore.state.wordSelections ?? [])

  return {
    word,
    wordHint,
    wordSelections,
  }
}
