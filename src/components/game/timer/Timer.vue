<template>
  <div
    v-if="show"
    class="absolute top-0 right-0 transform rotate-12"
    :style="{
      width: `${2 * radius}px`,
      height: `${2 * radius}px`,
    }"
  >
    <!-- Background -->
    <div class="w-full h-full flex justify-center items-center">
      <div
        class="rounded-full bg-gray-100 flex justify-center items-center text-4xl text-gray-800 font-semibold shadow-lg"
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
      <svg :width="radius * 2" :height="radius * 2">
        <circle
          stroke="#D1D5DB"
          fill="transparent"
          :stroke-dasharray="circumference + ' ' + circumference"
          :stroke-width="stroke"
          :r="outerRadius"
          :cx="radius"
          :cy="radius"
        />
        <circle
          class="progress"
          stroke="#DC2626"
          fill="transparent"
          :stroke-dasharray="`${circumference} ${circumference}`"
          :stroke-dashoffset="strokeDashoffset"
          :stroke-width="stroke"
          :r="outerRadius"
          :cx="radius"
          :cy="radius"
        />
        <circle
          class="progress"
          stroke="#6B7280"
          fill="transparent"
          :stroke-dasharray="`${innerDegree} ${innerDegree * (innerBase / 4 - 1)}`"
          :stroke-dashoffset="innerDegree / 2"
          :stroke-width="stroke"
          :r="innerRadius"
          :cx="radius"
          :cy="radius"
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
          :cx="radius"
          :cy="radius"
        />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue"

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
    show: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const stroke = computed<number>(() => Math.ceil(props.radius / 7.5))
    const outerRadius = computed<number>(() => props.radius - stroke.value)
    const innerRadius = computed<number>(() => props.radius - 2.5 * stroke.value)
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

    return {
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
