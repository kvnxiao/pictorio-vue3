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
import { Ref, computed, defineComponent, onMounted, ref } from "vue"
import Cookies from "js-cookie"
import { FLASH_MESSAGE } from "@/api/endpoints"
import axios from "axios"

export default defineComponent({
  name: "FlashMessage",
  setup() {
    const message: Ref<string | null> = ref(null)
    const messageType: Ref<FlashMessageType | null> = ref(null)
    const classObject = computed(() => {
      return {
        "is-info": messageType.value === "info",
        "is-warning": messageType.value === "warning",
        "is-danger": messageType.value === "error",
      }
    })

    onMounted(async () => {
      const errormsg = Cookies.get("errormsg")
      if (errormsg) {
        const resp = await axios.get<FlashMessage>(FLASH_MESSAGE)
        messageType.value = resp.data.type
        message.value = resp.data.message
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
