<template>
  <NavBar />
  <FlashMessage />
  <router-view />
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
@import "~bulma/bulma"

body, html
  height: 100%

#app
  height: 100%
  background: url("assets/pattern.png"), linear-gradient(to bottom, #0caedb 0%, #e1f7f6 100%)
  font-family: "Avenir", Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center

svg
  width: 100%
  height: 100%
</style>
