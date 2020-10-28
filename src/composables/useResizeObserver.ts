import { Ref, ToRefs, onMounted, onUnmounted, reactive, toRefs } from "vue"
import { ResizeObserver } from "@juggle/resize-observer"

export interface ResizeEvent {
  width: number
  height: number
}

export function useResizeObserver(element: Ref<HTMLElement | null>): ToRefs<ResizeEvent> {
  const elementSize: ResizeEvent = reactive({ width: 0, height: 0 })
  const ro = new ResizeObserver(entries => {
    if (entries.length > 0) {
      const [size] = entries[0].borderBoxSize
      elementSize.width = size.inlineSize
      elementSize.height = size.blockSize
    }
  })

  onMounted(() => {
    if (element.value) {
      ro.observe(element.value)
    }
  })

  onUnmounted(() => {
    if (element.value) {
      ro.unobserve(element.value)
    }
  })

  return toRefs(elementSize)
}
