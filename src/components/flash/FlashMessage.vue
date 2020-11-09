<template>
  <div v-if="message !== null" class="flash-message">
    <article class="message" :class="{ 'is-danger': isErrorMessage }">
      <div class="message-body">
        {{ message }}
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { Ref, defineComponent, onMounted, ref } from "vue"
import Cookies from "js-cookie"
import { FLASH_MESSAGE } from "@/api/endpoints"
import { FlashMessage } from "@/models/flashMessage"
import axios from "axios"

export default defineComponent({
  name: "FlashMessage",
  setup() {
    const message: Ref<string | null> = ref(null)
    const isErrorMessage: Ref<boolean> = ref(false)

    onMounted(async () => {
      const errormsg = Cookies.get("errormsg")
      if (errormsg) {
        const resp = await axios.get<FlashMessage>(FLASH_MESSAGE)
        if (resp.data.type === "error") {
          message.value = resp.data.message
          isErrorMessage.value = true
        }
      }
    })

    return {
      message,
      isErrorMessage,
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
