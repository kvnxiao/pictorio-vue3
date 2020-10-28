<template>
  <div class="home">
    <div class="card">
      <img src="/logo.svg" alt="Pictorio Logo" class="logo" />
      <div class="card-content">
        <a href="/create" class="button is-info">Create a new room</a>
        <hr />
        <div class="field">
          <p class="control">
            <input v-model="roomID" type="text" class="input" placeholder="Room ID" />
          </p>
        </div>
        <div class="field">
          <p class="control">
            <button class="button is-warning" @click="joinRoom">Join room</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Ref, defineComponent, ref } from "vue"

export default defineComponent({
  name: "Home",
  setup() {
    const roomID: Ref<string> = ref("")

    function joinRoom() {
      console.log(roomID.value)
    }

    return {
      joinRoom,
      roomID,
    }
  },
})
</script>

<style lang="sass" scoped>
.logo
  padding: 2rem

.home
  display: flex
  width: 100%
  height: calc(100% - 52px)
  align-items: center
  justify-content: center
  padding: 2rem

.card
  border-radius: 5px
</style>
