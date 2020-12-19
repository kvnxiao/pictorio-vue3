<template>
  <div
    class="w-full h-full p-4 max-w-screen-sm mx-auto flex flex-col items-center justify-center"
  >
    <div class="w-full bg-white rounded-md shadow-md flex flex-col items-center">
      <div class="w-5/6 p-8 border-b">
        <img class="w-48 mx-auto h-auto" src="@/assets/logo.svg" alt="Pictorio Logo" />
      </div>
      <div class="w-full p-8 grid grid-cols-1 space-y-8 md:grid-cols-2 md:space-y-0">
        <div class="flex flex-col items-center justify-start space-y-4">
          <p class="text-gray-800">Create your own room</p>
          <button
            class="flex-shrink-0 bg-blue-500 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-200"
            type="button"
            @click="createRoom"
          >
            Create Room
          </button>
        </div>
        <div class="flex flex-col items-center justify-start space-y-4">
          <p class="text-gray-800">Or join an existing room</p>
          <input
            id="price"
            v-model="roomID"
            class="focus:ring-yellow-500 focus:border-yellow-400 block mx-auto px-4 border-gray-300 shadow-sm rounded-md max-w-full"
            type="text"
            name="roomID"
            placeholder="Room ID"
          />
          <button
            class="flex-shrink-0 bg-indigo-500 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-200"
            type="button"
            @click="joinRoom"
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ROOM_CREATE, ROOM_EXISTS, ROOM_REDIRECT } from "@/api/endpoints"
import { RoomRequest, RoomResponse } from "@/service/room"
import { defineComponent, ref } from "vue"
import service from "@/service"
import { useRouter } from "vue-router"

export default defineComponent({
  name: "Home",
  setup() {
    const roomID = ref<string>("")
    const router = useRouter()

    const createRoom = async () => {
      const resp = await service.post<RoomResponse>(ROOM_CREATE)
      if (resp.data.exists) {
        router.push(ROOM_REDIRECT(resp.data.roomID))
      }
    }

    const joinRoom = async () => {
      const roomRequest: RoomRequest = {
        roomID: roomID.value,
      }
      const resp = await service.post<RoomResponse>(ROOM_EXISTS, roomRequest)
      if (resp.data.exists) {
        router.push(ROOM_REDIRECT(resp.data.roomID))
      }
    }

    return {
      createRoom,
      joinRoom,
      roomID,
    }
  },
})
</script>
