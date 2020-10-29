import App from "./App.vue"
import { FontAwesomeIcon } from "@/plugins/font-awesome"
import { createApp } from "vue"
import router from "./router"
import store from "./store"

createApp(App)
  .use(store)
  .use(router)
  .component("fa", FontAwesomeIcon)
  .mount("#app")
