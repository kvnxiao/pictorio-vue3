<template>
  <nav class="bg-gradient-to-b from-yellow-100 to-yellow-200 shadow-md">
    <div class="max-w-screen-2xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-14">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button -->
          <button
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <!-- Icon when menu is closed. -->
            <!--
              Heroicon name: menu
              Menu open: "hidden", Menu closed: "block"
            -->
            <svg
              class="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <!-- Icon when menu is open. -->
            <!--
              Heroicon name: x
              Menu open: "block", Menu closed: "hidden"
            -->
            <svg
              class="hidden h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div
          class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"
        >
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/">
              <img
                class="block lg:hidden h-10 w-auto"
                src="@/assets/logo.svg"
                alt="Workflow"
              />
            </router-link>
            <router-link to="/">
              <img
                class="hidden lg:block h-10 w-auto"
                src="@/assets/logo.svg"
                alt="Workflow"
              />
            </router-link>
          </div>
        </div>
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 h-full sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        >
          <div class="hidden sm:block sm:mr-6 h-full">
            <router-link
              to="/"
              class="text-gray-900 text-base flex items-center px-4 h-full hover:bg-yellow-50 hover:text-gray-700"
            >
              Home
            </router-link>
          </div>
          <!-- TODO: Profile icons -->
          <div class="ml-3 relative">
            <div>
              <button
                id="profile-menu"
                class="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-400"
                aria-haspopup="true"
              >
                <span class="sr-only">Open profile menu</span>
                <div class="h-8 w-8 rounded-full flex justify-center items-center">
                  <div class="text-white text-xl">?</div>
                </div>
              </button>
            </div>
            <div
              class="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                >Your Profile</a
              >
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                >Settings</a
              >
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                >Sign out</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"

export default defineComponent({
  name: "NavBar",
  setup() {
    // const enabledMobile = ref<boolean>(false)
    // const navBurger = ref<HTMLElement | null>(null)
    const navMenu = ref<HTMLElement | null>(null)

    // const hideListener = (event: MouseEvent) => {
    //   const target: Node = event.target as Node
    //   if (!navMenu.value?.contains(target) && !navBurger.value?.contains(target)) {
    //     enabledMobile.value = false
    //     document.removeEventListener("click", hideListener)
    //   }
    // }

    // const hamburger = (event: MouseEvent) => {
    //   event.preventDefault()
    //   enabledMobile.value = !enabledMobile.value
    //   if (enabledMobile.value) {
    //     document.addEventListener("click", hideListener)
    //   }
    // }

    return {
      // enabledMobile,
      // navBurger,
      navMenu,
      // hamburger,
    }
  },
})
</script>
