<template>
  <div v-if="msg !== null" class="absolute right-0 bottom-0 m-8">
    <div
      class="flex items-center border-l-4 p-4 rounded-md text-yellow-50"
      :class="{
        'bg-green-500': msg.type === 'info',
        'border-green-700': msg.type === 'info',
        'bg-yellow-500': msg.type === 'warning',
        'border-yellow-700': msg.type === 'warning',
        'bg-red-500': msg.type === 'error',
        'border-red-700': msg.type === 'error',
      }"
    >
      {{ msg.message }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from "vue"
import { ToastMessage } from "@/models/toastMessage"
import { ToastMessageMutations } from "@/store/toastMsgStore/mutations"
import { useToastMsgStore } from "@/store/toastMsgStore"

export default defineComponent({
  name: "ToastMessage",
  setup() {
    const toastMsgStore = useToastMsgStore()

    const msg = computed<ToastMessage | null>(() => toastMsgStore.state.message)

    watch(msg, (msg) => {
      if (msg !== null) {
        setTimeout(() => {
          toastMsgStore.commit(ToastMessageMutations.CLEAR)
        }, 5000)
      }
    })

    return {
      msg,
    }
  },
})
</script>
