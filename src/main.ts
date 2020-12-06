import { chatStore, chatStoreKey } from "./store/chatStore"
import { gameStateStore, gameStoreKey } from "@/store/gameStore"
import { playerStore, playerStoreKey } from "@/store/playerStore"
import App from "./App.vue"
import { FontAwesomeIcon } from "@/plugins/font-awesome"
import { createApp } from "vue"
import router from "./router"

createApp(App)
  .use(gameStateStore, gameStoreKey)
  .use(playerStore, playerStoreKey)
  .use(chatStore, chatStoreKey)
  .use(router)
  .component("fa", FontAwesomeIcon)
  .mount("#app")
