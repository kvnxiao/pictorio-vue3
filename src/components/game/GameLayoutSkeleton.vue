<template>
  <div class="flex w-full h-full items-center justify-center space-x-4 p-4">
    <div ref="left" class="panel-left" :style="{ height: centerHeight }">
      <div class="bg-white rounded-lg w-full h-full shadow-lg block relative" />
    </div>

    <div ref="center" class="panel-center" :style="{ maxWidth: maxWidthPx }">
      <div class="bg-white rounded-lg w-full h-full shadow-lg block relative">
        <div class="aspect-ratio">
          <div
            class="absolute top-0 left-0 w-full h-full flex justify-center items-center"
          >
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p class="text-yellow-900 text-2xl">Loading</p>
          </div>
        </div>
      </div>
    </div>

    <div ref="right" class="panel-right" :style="{ height: centerHeight }">
      <div class="bg-white rounded-lg w-full h-full shadow-lg block relative" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from "vue"
import { Panels } from "@/models/panels"
import { useResizeObserver } from "@/composables/useResizeObserver"

export default defineComponent({
  name: "GameLayoutSkeleton",
  setup() {
    const panels: Panels = reactive({
      left: null,
      center: null,
      right: null,
    })
    const { left, center, right } = toRefs(panels)

    const { height } = useResizeObserver(center)
    const maxWidth = ref<number>(1500)

    const centerHeight = computed<string>(() => `${height.value}px`)
    const maxWidthPx = computed<string>(() => `${maxWidth.value}px`)

    return {
      left,
      center,
      right,
      centerHeight,
      maxWidthPx,
    }
  },
})
</script>
