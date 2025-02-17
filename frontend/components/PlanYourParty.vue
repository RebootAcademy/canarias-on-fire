<template>
  <div
    class="flex flex-col justify-center items-center bg-background p-8 w-full"
  >
  <div
      class="w-full grid justify-items-center items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 sm:gap-4 lg:gap-4"
    >
      <UserCard
        v-for="user in userList"
        :key="user._id"
        :user="user"
        :category="selectCategoryForFilterCompany"
      />
   </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const paymentStore = usePaymentStore()
const eventStore = useEventStore()

const {
  selectCategoryForFilterCompany
} = storeToRefs(eventStore)

const userList = ref([])

watch(
  () => selectCategoryForFilterCompany.value,
  (newValue) => {
    filterUsers(newValue)
  },
  {
    immediate: true
  }
)

watch(
  () => eventStore.filters.islands,
  () => {
    filterUsers(selectCategoryForFilterCompany.value)
  },
  {
    immediate: true,
    deep: true
  }
)

function filterUsers(category) {
  if (!userStore.users || !Array.isArray(userStore.users)) {
    userList.value = []
    return
  }

  userList.value = userStore.users
    .filter(user => {
      console.log(user)
        if (category === 'all' || !category) {
          return user.isActive && 
          ((user.sector === 'services') || user.role === 'musician' || user.__t === 'musician')
        }
        if (category === 'bands') {
          return user.role === 'musician'
        }
        console.log(category)
        return user.serviceType === category
    })
    .sort((a, b) => getPriority(b) - getPriority(a))
    .filter(user => {
      const eventIsland = getIslandFromPostalCode(
        user.postalCode
      )
      if (eventStore.filters.islands.length) {
        return eventStore.filters.islands.includes(eventIsland)
      } else {
        return true
      }
    })
}

onMounted(() => {
  userStore.fetchUsers()
})

function getPriority(user) {
  return user.activeSubscription?.status === 'active' ? 1 : 0
}
</script>
