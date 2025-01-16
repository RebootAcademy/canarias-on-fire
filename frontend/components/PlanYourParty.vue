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
      />
   </div>
    <!-- <div
      v-if="
        selectCategoryForFilterCompany !== 'bands' &&
        selectCategoryForFilterCompany !== 'foodtruck'
      "
      class="w-full grid justify-items-center items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-4"
    >
      <PromotionCard
        v-for="promotion in fetchedUsers"
        :key="promotion._id"
        :promotion="promotion"
      />
    </div>
    <div
      v-if="selectCategoryForFilterCompany !== 'bands' && numOfUsers > 9"
      class="mt-6 w-full justify-center items-center"
    >
      <div class="w-1/3">
        <CustomBtn
          :title="t('buttons.seeMore')"
          :action="() => router.push('/promotions')"
        />
      </div>
    </div>
    <BandList
      v-if="
        selectCategoryForFilterCompany &&
        selectCategoryForFilterCompany === 'bands'
      "
    />
    <FoodtruckList
      v-if="
        selectCategoryForFilterCompany &&
        selectCategoryForFilterCompany === 'foodtruck'
      "
    /> -->
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

function filterUsers(category) {
  if (!userStore.users || !Array.isArray(userStore.users)) {
    userList.value = [] // Reset if there are no users
    return
  }

  userList.value = userStore.users
    .filter(user => {
        if (category === 'all' || !category) {
          return user.isActive && user.role !== 'admin'
        }
        console.log(user.bandName)
        console.log(user.role)
        if (category === 'bands') {
          return user.role === 'musician'
        }
        return user.serviceType === category
    })
    .sort((a, b) => getPriority(b) - getPriority(a))
}

console.log(userList.value)
onMounted(() => {
  userStore.fetchUsers()
})

function getPriority(user) {
  return user.activeSubscription?.status === 'active' ? 1 : 0
}
</script>
