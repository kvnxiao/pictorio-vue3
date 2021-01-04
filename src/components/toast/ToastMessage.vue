<template>
  <transition name="slide-fade">
    <div v-if="msg !== null" class="absolute top-0 right-0 xl:bottom-0 xl:top-auto m-8">
      <div
        class="flex items-center border-l-4 p-4 rounded-md text-white"
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
  </transition>
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

<style scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.75s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
