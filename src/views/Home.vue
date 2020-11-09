<template>
  <div class="home">
    <div class="card">
      <img src="@/assets/logo.svg" alt="Pictorio Logo" class="logo" />
      <div class="card-content">
        <button class="button is-info" @click="createRoom">Create room</button>
        <hr />
        <div class="field">
          <p class="control">
            <input v-model="roomID" type="text" class="input" placeholder="Room ID" />
          </p>
        </div>
        <div class="field">
          <p class="control">
            <a :href="joinRoom" class="button is-warning">Join room</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CREATE_ROOM, ROOM } from "@/api/endpoints"
import { Ref, computed, defineComponent, ref } from "vue"
import { RoomResponse } from "@/models/room"
import axios from "axios"
import { useRouter } from "vue-router"

export default defineComponent({
  name: "Home",
  setup() {
    const roomID: Ref<string> = ref("")
    const router = useRouter()

    const createRoom = async () => {
      const resp = await axios.post<RoomResponse>(CREATE_ROOM)
      if (resp.data.exists) {
        router.push(ROOM(resp.data.roomID))
      }
    }

    const joinRoom = computed(() => ROOM(roomID.value))

    return {
      createRoom,
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
  padding: 1.5rem
</style>
