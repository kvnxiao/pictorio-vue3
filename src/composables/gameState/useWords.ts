import { ComputedRef, computed } from "vue"
import { Hint } from "@/models/hint"
import { isEmpty } from "lodash"
import { useGameStore } from "@/store/gameStore"

const HINT_CHAR = "_"

export interface WordsState {
  word: ComputedRef<string>
  wordHint: ComputedRef<string[][]>
  wordSelections: ComputedRef<string[]>
}

function mappedHints(wordIndex: number, hints: Hint[]): Record<number, Hint> {
  const initialValue: Record<number, Hint> = {}
  return hints
    .filter((hint) => hint.wordIndex === wordIndex)
    .reduce((obj: Record<number, Hint>, item: Hint) => {
      return {
        ...obj,
        [item.charIndex]: item,
      }
    }, initialValue)
}

function mappedWord(
  emptyWordLength: number,
  mappedHints: Record<number, Hint>,
): string[] {
  const word: string[] = []
  for (let i = 0; i < emptyWordLength; i++) {
    if (i in mappedHints) {
      word.push(String.fromCharCode(mappedHints[i].char))
    } else {
      word.push(HINT_CHAR)
    }
  }
  return word
}

export function useWords(): WordsState {
  const gameStore = useGameStore()

  const hints = computed<Hint[]>(() => gameStore.state.hints ?? [])

  const word = computed<string>(() => gameStore.state.currentWord ?? "")

  const wordHint = computed<string[][]>(() => {
    if (
      gameStore.state.currentWordLength &&
      !isEmpty(gameStore.state.currentWordLength)
    ) {
      const words: string[][] = gameStore.state.currentWordLength.map(
        (wordLength: number, wordIndex: number) =>
          mappedWord(wordLength, mappedHints(wordIndex, hints.value)),
      )
      return words
    }
    return []
  })

  const wordSelections = computed<string[]>(() => gameStore.state.wordSelections ?? [])

  return {
    word,
    wordHint,
    wordSelections,
  }
}
