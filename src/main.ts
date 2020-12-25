import "@/styles/index.scss"
import { chatStore, chatStoreKey } from "./store/chatStore"
import { gameStateStore, gameStoreKey } from "@/store/gameStore"
import { toastMsgStore, toastMsgStoreKey } from "./store/toastMsgStore"
import { userStore, userStoreKey } from "@/store/userStore"
import App from "./App.vue"
import { createApp } from "vue"
import router from "./router"

createApp(App)
  .use(gameStateStore, gameStoreKey)
  .use(userStore, userStoreKey)
  .use(chatStore, chatStoreKey)
  .use(toastMsgStore, toastMsgStoreKey)
  .use(router)
  .mount("#app")
