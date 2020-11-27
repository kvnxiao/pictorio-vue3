import { gameStateStore, key } from "./store/gameStore"
import App from "./App.vue"
import { FontAwesomeIcon } from "@/plugins/font-awesome"
import { createApp } from "vue"
import router from "./router"

createApp(App)
  .use(gameStateStore, key)
  .use(router)
  .component("fa", FontAwesomeIcon)
  .mount("#app")
