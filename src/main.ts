import { chatStore, chatStoreKey } from "./store/chatStore"
import { gameStateStore, gameStoreKey } from "@/store/gameStore"
import { userStore, userStoreKey } from "@/store/userStore"
import App from "./App.vue"
import { FontAwesomeIcon } from "@/plugins/font-awesome"
import { createApp } from "vue"
import router from "./router"

createApp(App)
  .use(gameStateStore, gameStoreKey)
  .use(userStore, userStoreKey)
  .use(chatStore, chatStoreKey)
  .use(router)
  .component("fa", FontAwesomeIcon)
  .mount("#app")
