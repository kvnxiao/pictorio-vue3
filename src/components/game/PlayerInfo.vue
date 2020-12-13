<template>
  <div class="info">
    <ul>
      <li v-for="u of users" :key="u.id">
        <PlayerEntry :name="u.name" :points="0" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { ComputedRef, computed, defineComponent } from "vue"
import { Status, UserStatus } from "@/store/userStore/state"
import PlayerEntry from "@/components/game/player/PlayerEntry.vue"
import { User } from "@/models/user"
import { useUserStore } from "@/store/userStore"

export default defineComponent({
  name: "PlayerInfo",
  components: { PlayerEntry },
  setup() {
    const userStore = useUserStore()

    const users: ComputedRef<User[]> = computed(() =>
      Object.values(userStore.state.userIds)
        .filter((status: UserStatus) => status.status === Status.JOINED)
        .map((status: UserStatus) => status.user),
    )

    return {
      users,
    }
  },
})
</script>

<style lang="sass" scoped>
.info
  user-select: none
  li
    padding: 1rem
</style>
