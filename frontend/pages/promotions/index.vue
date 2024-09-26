<template>
    <div class="flex flex-col items-center bg-background">
    <Hero />
    <div class="w-2/3">
      <div class="flex items-center justify-between w-full px-4 mb-4">
        <h2 class="text-3xl font-semibold text-primary">{{ $t('promotionsTitle') }}</h2>
        <div class="flex gap-4 items-center">
          <SearchInput v-model="searchQuery" />
          <CustomBtn
            :title="$t('filterBtn')"
            @click="openFilterModal"
          />
          <FilterModal />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <PromotionCard
          v-for="promotion in limitedPromotions"
          :key="promotion._id"
          :promotion="promotion"
        />
      </div>
      <p v-if="limitedPromotions.length === 0" class="text-gray-500 mt-4">
       {{ $t('notEventsFound')}}
      </p>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const eventStore = useEventStore()
const subscriptionStore = useSubscriptionStore()
const { filteredEvents } = storeToRefs(eventStore)

const searchQuery = computed({
  get: () => eventStore.searchQuery,
  set: (value) => eventStore.setSearchQuery(value)
})

const openFilterModal = () => {
  eventStore.setFilterModalOpen(true)
}

const limitedPromotions = computed(() => {
  return filteredEvents.value
    .filter(promotion => promotion.status === 'published' && promotion.eventType === 'promotion' && promotion.userId?.isActive && promotion.userId?.isValidated)
    .sort((a, b) => {
      const priorityA = getPromoPriority(a)
      const priorityB = getPromoPriority(b)

      if (priorityA !== priorityB) {
        return priorityB - priorityA
      }
      return compareDates(a.eventDate, b.eventDate)
    })
})

console.log(limitedPromotions.value)

function getPromoPriority(promotion) {
  console.log(promotion.subscription.name)
  const subscriptionName =
    promotion.subscription.name 

  let priority;
  if (subscriptionName === 'gold') {
    priority = 2
  } else if (subscriptionName === 'basic') {
    priority = 1
  } else {
    priority = 0
  }
  return priority
}

function compareDates(dateA, dateB) {
  if (!dateA || !dateB) {
    if (!dateA && !dateB) return 0
    return dateA ? -1 : 1
  }
  if (dateA.year !== dateB.year) return dateA.year - dateB.year
  if (dateA.month !== dateB.month) return dateA.month - dateB.month
  return dateA.day - dateB.day;
}
</script>