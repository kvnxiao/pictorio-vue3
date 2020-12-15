<template>
  <div class="flex flex-col h-full">
    <NavBar />
    <FlashMessage />
    <router-view />
  </div>
</template>

<script lang="ts">
import FlashMessage from "@/components/flash/FlashMessage.vue"
import NavBar from "@/components/NavBar.vue"
import { defineComponent } from "vue"

export default defineComponent({
  name: "App",
  components: { NavBar, FlashMessage },
})
</script>

<style lang="sass">
body, html
  height: 100%

#app
  height: 100%
  background: url("assets/pattern.png"), linear-gradient(to bottom, #0caedb 0%, #e1f7f6 100%)
  font-family: Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
</style>
