<template>
  <div
    class="w-full h-full p-4 max-w-screen-sm mx-auto flex flex-col items-center justify-center"
  >
    <div
      class="w-full bg-white rounded-md shadow-md flex flex-col items-center px-2 py-1 md:px-16 md:py-8"
    >
      <div class="w-full p-6 border-b mb-6">
        <img class="w-48 mx-auto h-auto" src="@/assets/logo.svg" alt="Pictorio Logo" />
      </div>
      <div>Welcome to Pictorio, a draw-and-guess game!</div>
      <div class="w-full p-6 flex flex-col items-center justify-between space-y-6">
        <div
          class="w-full flex justify-between items-center flex-col md:flex-row space-y-2 md:space-y-0"
        >
          <div class="flex items-center flex-col md:flex-row">
            <p class="mr-2">Your name:</p>
            <input
              v-model="uname"
              class="h-9 w-36 focus:ring-yellow-500 focus:border-yellow-400 block mx-auto px-4 border-gray-300 shadow-sm rounded-md max-w-full"
              type="text"
              name="uname"
              :placeholder="namePlaceholder"
            />
          </div>
          <button
            class="w-29 flex-shrink-0 bg-blue-500 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-200"
            type="button"
            @click="changeName"
          >
            Change Name
          </button>
        </div>
        <div class="w-full flex justify-between items-center flex-col md:flex-row">
          <p class="text-gray-800">Create your own room</p>
          <button
            class="flex-shrink-0 bg-green-500 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-green-200"
            type="button"
            @click="createRoom"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { NameRequest, NameResponse } from "@/service/name"
import { ROOM_CREATE, ROOM_REDIRECT, USER_NAME } from "@/api/endpoints"
import { defineComponent, onBeforeMount, ref } from "vue"
import { RoomResponse } from "@/service/room"
import { ToastMessageMutations } from "@/store/toastMsgStore/mutations"
import { service } from "@/service"
import { useRouter } from "vue-router"
import { useToastMsgStore } from "@/store/toastMsgStore"

export default defineComponent({
  name: "Home",
  setup() {
    const uname = ref<string>("")
    const isGenerated = ref<boolean>(true)
    const namePlaceholder = ref<string>("Name")
    const router = useRouter()
    const toastMsgStore = useToastMsgStore()

    const cantConnect = () => {
      toastMsgStore.commit(ToastMessageMutations.SET, {
        message: "Unable to connect to server.",
        type: "error",
      })
    }

    onBeforeMount(async () => {
      try {
        const resp = await service.get<NameResponse>(USER_NAME)
        if (resp.data.name) {
          namePlaceholder.value = resp.data.name
          isGenerated.value = resp.data.isGenerated
          if (!isGenerated.value) {
            uname.value = resp.data.name
          }
        }
      } catch (err) {
        cantConnect()
      }
    })

    const createRoom = async () => {
      try {
        const resp = await service.post<RoomResponse>(ROOM_CREATE)
        if (resp.data.exists) {
          router.push(ROOM_REDIRECT(resp.data.roomID))
        }
      } catch (err) {
        cantConnect()
      }
    }

    const changeName = async () => {
      try {
        const payload: NameRequest = { name: uname.value }
        const resp = await service.post<NameResponse>(USER_NAME, payload)
        if (resp.status === 200) {
          uname.value = resp.data.name
          namePlaceholder.value = resp.data.name
          isGenerated.value = resp.data.isGenerated
          toastMsgStore.commit(ToastMessageMutations.SET, {
            message: `Changed name to ${resp.data.name}!`,
            type: "info",
          })
        } else {
          toastMsgStore.commit(ToastMessageMutations.SET, {
            message: `Could not change name!`,
            type: "error",
          })
        }
      } catch (err) {
        cantConnect()
      }
    }

    return {
      createRoom,
      uname,
      namePlaceholder,
      changeName,
    }
  },
})
</script>
