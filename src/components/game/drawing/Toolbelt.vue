<template>
  <div class="max-w-screen-md flex justify-center mx-auto relative bottom-14">
    <div class="rounded-l-full flex bg-gray-200 p-2 pl-3 space-x-2">
      <template v-for="(colour, index) of COLOURS" :key="colour">
        <ColourTool :colour-idx="index" :self-user="selfUser" />
      </template>
    </div>
    <div class="tool-spacer w-2 bg-gray-200" />
    <div class="flex bg-gray-200 p-2 space-x-2">
      <template v-for="(thickness, index) of THICKNESSES" :key="thickness">
        <ThicknessTool :thickness-idx="index" :self-user="selfUser" />
      </template>
    </div>
    <div class="tool-spacer w-2 bg-gray-200" />
    <div class="rounded-r-full flex bg-gray-200 p-2 pr-3 space-x-2">
      <ClearTool @tool-clear="$emit('tool-clear')" />
      <UndoTool @tool-undo="$emit('tool-undo')" />
      <RedoTool @tool-redo="$emit('tool-redo')" />
    </div>
  </div>
</template>

<script lang="ts">
import { COLOURS, THICKNESSES } from "@/models/drawing"
import { PropType, defineComponent } from "vue"
import ClearTool from "@/components/game/drawing/ClearTool.vue"
import ColourTool from "@/components/game/drawing/ColourTool.vue"
import RedoTool from "@/components/game/drawing/RedoTool.vue"
import ThicknessTool from "@/components/game/drawing/ThicknessTool.vue"
import UndoTool from "@/components/game/drawing/UndoTool.vue"
import { User } from "@/models/user"

export default defineComponent({
  name: "Toolbelt",
  components: {
    ClearTool,
    ColourTool,
    RedoTool,
    ThicknessTool,
    UndoTool,
  },
  props: {
    selfUser: {
      type: Object as PropType<User>,
      required: true,
    },
  },
  emits: ["tool-clear", "tool-redo", "tool-undo"],
  setup() {
    return {
      COLOURS,
      THICKNESSES,
    }
  },
})
</script>
