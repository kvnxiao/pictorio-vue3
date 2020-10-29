<template>
  <div id="nav" class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <div id="logo" class="navbar-item">
        <router-link class="navbar-item" to="/">
          <img src="/logo.svg" alt="Pictorio Logo" />
        </router-link>
      </div>

      <a
        ref="navBurger"
        :class="{ 'is-active': enabledMobile }"
        class="navbar-burger burger"
        role="button"
        aria-label="menu"
        aria-expanded="false"
        data-target="nav-menu"
        @click="hamburger"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </a>
    </div>

    <div
      id="nav-menu"
      ref="navMenu"
      class="navbar-menu"
      :class="{ 'is-active': enabledMobile }"
    >
      <div class="navbar-end">
        <router-link class="navbar-item" to="/">Home</router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Ref, defineComponent, ref } from "vue"

export default defineComponent({
  name: "NavBar",
  setup() {
    const enabledMobile: Ref<boolean> = ref(false)
    const navBurger: Ref<HTMLElement | null> = ref(null)
    const navMenu: Ref<HTMLElement | null> = ref(null)

    function hideListener(event: MouseEvent) {
      const target: Node = event.target as Node
      if (!navMenu.value?.contains(target) && !navBurger.value?.contains(target)) {
        enabledMobile.value = false
        document.removeEventListener("click", hideListener)
      }
    }

    function hamburger(event: MouseEvent) {
      event.preventDefault()
      enabledMobile.value = !enabledMobile.value
      if (enabledMobile.value) {
        document.addEventListener("click", hideListener)
      }
    }

    return {
      enabledMobile,
      navBurger,
      navMenu,
      hamburger,
    }
  },
})
</script>

<style lang="sass">
#nav
  box-shadow: 0 3px 3px rgba(10,10,10,0.2)
  background: linear-gradient(to bottom, #fff6ca 0%, #e4da9c 100%)

  #logo
    padding: 0 0.75rem
    a
      padding: 0
    img
      max-height: 2.75rem
      height: 2.75rem

  .navbar-menu.is-active
    position: absolute
    right: 1.625rem
    padding: 0.5rem 1rem
  a
    user-select: none
    &.router-link-exact-active
      color: #0A0A0A

  .navbar-menu
    a
      border-bottom: 1px solid transparent
      border-right: none

  .navbar-menu.is-active
    a
      border-right: 1px solid transparent
      border-bottom: none
</style>
