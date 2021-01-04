<template>
  <div
    v-if="show"
    class="absolute top-0 right-0 transform rotate-12 pointer-events-none"
    :style="{
      width: `${2 * normalizedRadius}px`,
      height: `${2 * normalizedRadius}px`,
    }"
  >
    <!-- Background -->
    <div class="w-full h-full flex justify-center items-center">
      <div
        class="rounded-full bg-gray-100 flex justify-center items-center text-xl xl:text-4xl text-gray-800 font-semibold shadow-lg"
        :style="{
          width: `${2 * outerRadius + stroke * 1.5}px`,
          height: `${2 * outerRadius + stroke * 1.5}px`,
        }"
      >
        {{ normalizedSeconds }}
      </div>
    </div>
    <!-- Circle SVG -->
    <div class="absolute top-0">
      <svg :width="normalizedRadius * 2" :height="normalizedRadius * 2">
        <circle
          stroke="#D1D5DB"
          fill="transparent"
          :stroke-dasharray="circumference + ' ' + circumference"
          :stroke-width="stroke"
          :r="outerRadius"
          :cx="normalizedRadius"
          :cy="normalizedRadius"
        />
        <circle
          class="progress"
          stroke="#DC2626"
          fill="transparent"
          :stroke-dasharray="`${circumference} ${circumference}`"
          :stroke-dashoffset="strokeDashoffset"
          :stroke-width="stroke"
          :r="outerRadius"
          :cx="normalizedRadius"
          :cy="normalizedRadius"
        />
        <circle
          class="progress"
          stroke="#6B7280"
          fill="transparent"
          :stroke-dasharray="`${innerDegree} ${innerDegree * (innerBase / 4 - 1)}`"
          :stroke-dashoffset="innerDegree / 2"
          :stroke-width="stroke"
          :r="innerRadius"
          :cx="normalizedRadius"
          :cy="normalizedRadius"
        />
        <circle
          class="progress"
          stroke="#6B7280"
          fill="transparent"
          :stroke-dasharray="`${innerSmallDegree} ${
            innerSmallDegree * (innerSmallBase / 12 - 1)
          }`"
          :stroke-dashoffset="innerSmallDegree / 2"
          :stroke-width="stroke / 2"
          :r="innerRadius"
          :cx="normalizedRadius"
          :cy="normalizedRadius"
        />
      </svg>
    </div>
    <audio ref="sine440">
      <source src="@/assets/440.wav" type="audio/wav" />
      Your browser does not support the audio element.
    </audio>
    <audio ref="sine880">
      <source src="@/assets/880.wav" type="audio/wav" />
      Your browser does not support the audio element.
    </audio>
    <audio ref="tick3">
      <source src="@/assets/tick3.wav" type="audio/wav" />
      Your browser does not support the audio element.
    </audio>
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent, ref, watch } from "vue"
import { TurnStatus } from "@/models/status"

export default defineComponent({
  name: "Timer",
  props: {
    radius: {
      type: Number,
      default: 56,
    },
    maxSeconds: {
      type: Number,
      required: true,
    },
    seconds: {
      type: Number,
      required: true,
    },
    turnStatus: {
      type: Number as PropType<TurnStatus>,
      required: true,
    },
    isDesktopWidth: {
      type: Boolean,
      required: true,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const normalizedRadius = computed<number>(() =>
      props.isDesktopWidth ? props.radius : props.radius / 2.5,
    )

    const stroke = computed<number>(() => Math.ceil(normalizedRadius.value / 7.5))
    const outerRadius = computed<number>(() => normalizedRadius.value - stroke.value)
    const innerRadius = computed<number>(
      () => normalizedRadius.value - 2.5 * stroke.value,
    )
    const circumference = computed<number>(() => outerRadius.value * 2 * Math.PI)
    const innerBase = ref<number>(60)
    const innerDegree = computed<number>(
      () => (innerRadius.value * 2 * Math.PI) / innerBase.value,
    )
    const innerSmallBase = computed<number>(() => innerBase.value * 3)
    const innerSmallDegree = computed<number>(
      () => (innerRadius.value * 2 * Math.PI) / innerSmallBase.value,
    )

    const normalizedSeconds = computed<number>(() => {
      const normSeconds = Math.min(props.seconds, props.maxSeconds)
      return normSeconds < 0 ? 0 : normSeconds
    })

    const strokeDashoffset = computed<number>(
      () =>
        circumference.value -
        (normalizedSeconds.value / props.maxSeconds) * circumference.value,
    )

    const sine440 = ref<HTMLAudioElement | null>(null)
    const sine880 = ref<HTMLAudioElement | null>(null)
    const tick3 = ref<HTMLAudioElement | null>(null)

    watch(normalizedSeconds, (seconds: number) => {
      switch (props.turnStatus) {
        case TurnStatus.NEXT_PLAYER:
          if (seconds <= 0) {
            sine880.value?.play()
          } else if (seconds <= 3) {
            sine440.value?.play()
          }
          break
        case TurnStatus.SELECTION:
        case TurnStatus.DRAWING:
          if (seconds < 3) {
            tick3.value?.play()
          }
          break
      }
    })

    return {
      normalizedRadius,
      stroke,
      outerRadius,
      innerRadius,
      circumference,
      innerBase,
      innerDegree,
      innerSmallBase,
      innerSmallDegree,
      normalizedSeconds,
      strokeDashoffset,
      sine440,
      sine880,
      tick3,
    }
  },
})
</script>

<style lang="scss" scoped>
circle.progress {
  transition: 0.35s stroke-dashoffset;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
</style>
