import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router"
import Game from "@/views/Game.vue"
import Home from "@/views/Home.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/room/:roomID",
    name: "Game",
    component: Game,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
