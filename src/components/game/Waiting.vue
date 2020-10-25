<template>
  <div id="wait">
    <div class="wrapper">
      <div class="box">
        <div class="waiting">
          <div class="card">
            <div class="card-image">
              <img src="/logo.svg" alt="Pictorio Logo" />
            </div>
            <div class="card-content">
              <div class="content">Waiting for all players to be ready</div>
              <div class="subtitle">{{ readyPlayers }} / {{ maxPlayers }}</div>
              <button
                class="button is-medium"
                :class="{ 'is-info': !ready, 'is-warning': ready }"
                @click="readyToggle"
              >
                {{ readyText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from "vue"

export default defineComponent({
  name: "Waiting",
  setup() {
    const ready: Ref<boolean> = ref(false)
    const readyPlayers: Ref<number> = ref(1)
    const maxPlayers = 8

    const readyText = computed(() => (ready.value ? "Unready" : "Ready"))

    const readyToggle = () => {
      ready.value = !ready.value
    }

    return {
      ready,
      readyPlayers,
      maxPlayers,
      readyText,
      readyToggle,
    }
  },
})
</script>

<style lang="sass" scoped>
#wait
  display: flex
  justify-content: center
  align-items: center
  position: relative

.wrapper
  display: block
  position: relative
  width: 100%
  padding-top: (10 / 16) * 100%

.box
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0

.waiting
  display: flex
  align-items: center
  justify-content: center
  background: white
  border-radius: 3px
  width: 100%
  height: 100%

.card
  border-radius: 5px
  border: 1px solid #ECF0F0

.card-image
img
  padding: 2rem 2rem
</style>
