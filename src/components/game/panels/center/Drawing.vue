<template>
  <div class="h-0">
    <DrawingCanvas
      :self-user="selfUser"
      :canvas-width="canvasWidth"
      :canvas-height="canvasHeight"
      :max-canvas-width="maxCanvasWidth"
      :enabled="canvasEnabled"
      :is-drawer-turn="isDrawerTurn"
    />
    <transition name="bounce">
      <Guess
        v-if="turnStatus === TurnStatus.DRAWING"
        :drawing-user="drawingUser"
        :is-drawer-turn="isDrawerTurn"
      />
    </transition>
    <Selection
      v-if="
        turnStatus === TurnStatus.SELECTION || turnStatus === TurnStatus.NEXT_PLAYER
      "
      :self-user="selfUser"
      :drawing-user="drawingUser"
      :is-drawer-turn="isDrawerTurn"
      :turn-status="turnStatus"
    />
    <Timer :max-seconds="maxTime" :seconds="timeLeft" show />
  </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent, toRef } from "vue"
import DrawingCanvas from "@/components/game/drawing/DrawingCanvas.vue"
import Guess from "@/components/game/drawing/Guess.vue"
import Selection from "@/components/game/drawing/Selection.vue"
import Timer from "@/components/game/drawing/Timer.vue"
import { TurnStatus } from "@/models/status"
import { User } from "@/models/user"
import { useTimer } from "@/composables/gameState/useTimer"

export default defineComponent({
  name: "Drawing",
  components: {
    DrawingCanvas,
    Guess,
    Selection,
    Timer,
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
    canvasHeight: {
      type: Number,
      default: 0,
    },
    canvasWidth: {
      type: Number,
      default: 0,
    },
    maxCanvasWidth: {
      type: Number,
      default: 0,
    },
    turnStatus: {
      type: Number as PropType<TurnStatus>,
      required: true,
    },
  },
  setup(props) {
    const isDrawerTurn = computed<boolean>(
      () => props.drawingUser?.id === props.selfUser.id,
    )

    const canvasEnabled = computed<boolean>(
      () =>
        props.turnStatus === TurnStatus.DRAWING &&
        props.drawingUser?.id === props.selfUser.id,
    )

    const { maxTime, timeLeft } = useTimer(toRef(props, "turnStatus"))

    return {
      TurnStatus,
      isDrawerTurn,
      canvasEnabled,
      maxTime,
      timeLeft,
    }
  },
})
</script>
