<template>
  <div v-if="message !== null" class="flash-message">
    <article class="message" :class="classObject">
      <div class="message-body">
        {{ message }}
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { FlashMessage, FlashMessageType } from "@/models/flashMessage"
import { computed, defineComponent, onMounted, ref } from "vue"
import Cookies from "js-cookie"
import { FLASH_MESSAGE } from "@/api/endpoints"
import service from "@/service"

export default defineComponent({
  name: "FlashMessage",
  setup() {
    const message = ref<string | null>(null)
    const messageType = ref<FlashMessageType | null>(null)
    const classObject = computed(() => {
      return {
        "is-info": messageType.value === "info",
        "is-warning": messageType.value === "warning",
        "is-danger": messageType.value === "error",
      }
    })

    const clearMessage = () => {
      message.value = null
      messageType.value = null
    }

    onMounted(async () => {
      const errormsg = Cookies.get("errormsg")
      if (errormsg) {
        const resp = await service.get<FlashMessage>(FLASH_MESSAGE)
        messageType.value = resp.data.type
        message.value = resp.data.message
        setTimeout(() => {
          clearMessage()
        }, 5000)
      }
    })

    return {
      message,
      classObject,
    }
  },
})
</script>

<style lang="sass">
.flash-message
  position: absolute
  bottom: 3rem
  right: 3rem
  min-width: 15rem
  max-width: 20rem
</style>
