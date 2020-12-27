<template>
  <div class="flex flex-col h-full">
    <NavBar />
    <router-view />
    <ToastMessage />
  </div>
</template>

<script lang="ts">
import NavBar from "@/components/NavBar.vue"
import ToastMessage from "@/components/toast/ToastMessage.vue"
import { defineComponent } from "vue"

export default defineComponent({
  name: "App",
  components: { NavBar, ToastMessage },
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
