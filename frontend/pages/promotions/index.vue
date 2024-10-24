<template>
  <div class="flex flex-col items-center bg-background">
    <Hero class="hidden sm:flex" />
    <div class="w-full px-4 mt-8 md:mt-0 sm:w-2/3">
      <div
        class="flex flex-col gap-2 md:flex-row md:gap-0 items-center justify-between w-full px-4 mb-4 md:mt-8"
      >
        <div class="flex w-full items-start">
          <h2
            class="text-2xl md:text-3xl lg:text-4xl font-semibold text-primary"
          >
            {{ $t('promotionsTitle') }}
          </h2>
        </div>
        <div
          class="flex flex-col-reverse md:flex-row gap-4 items-center md:w-full justify-end"
        >
          <CustomSelect
            :items="eventDiscounts"
            :placeholder="selectedPromotion"
            :optionDefault="selectedPromotion"
            v-model:selected="selectedPromotion"
          />
          <div class="flex items-center gap-4">
            <SearchInput v-model="searchQuery" />
            <CustomBtn :title="$t('filterBtn')" @click="openFilterModal" />
          </div>
          <FilterModal type="promotion"/>
        </div>
      </div>
      <div class="flex justify-center w-full md:justify-start md:w-1/3 mb-6">
        <GeolocationMap />
      </div>
      <!-- <PromotionsTabs @update:selectedFilter="handleTabChange" /> -->
      <div v-if="limitedPromotions.length > 0">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-8"
        >
          <PromotionCard
            v-for="promotion in limitedPromotions"
            :key="promotion._id"
            :promotion="promotion"
          />
        </div>
        <!-- <div v-if="selectTabOption === 'all'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <PromotionCard
            v-for="promotion in limitedPromotions"
            :key="promotion._id"
            :promotion="promotion"
          />
        </div>
 -->
        <!-- <PromotionsNear v-else /> -->
      </div>
      <p v-if="limitedPromotions.length === 0" class="text-gray-500 mt-4">
        {{ $t('notPromotionsFound') }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
const { t } = useI18n()
const userStore = useUserStore()
const eventStore = useEventStore()
const subscriptionStore = useSubscriptionStore()
const { filteredEvents } = storeToRefs(eventStore)

const selectedPromotion = ref('all')
const selectTabOption = ref('all')

const eventDiscounts = computed(() => {
  return [
    { label: t('onBoarding.step2Genres.all'), value: 'all' },
    { label: t('eventTypeDiscount.2x1'), value: '2x1' },
    { label: t('eventTypeDiscount.3x1'), value: '3x1' },
    { label: t('eventTypeDiscount.free'), value: 'free' },
    { label: t('eventTypeDiscount.other'), value: 'other' },
  ]
})

const searchQuery = computed({
  get: () => eventStore.searchQuery,
  set: (value) => eventStore.setSearchQuery(value),
})

const openFilterModal = () => {
  eventStore.setFilterModalOpen(true)
}

const limitedPromotions = computed(() => {
  let filterDiscount
  if (selectedPromotion.value === 'all') {
    filterDiscount = filteredEvents.value
  } else {
    filterDiscount = filteredEvents.value.filter(
      (event) => event.eventDiscount === selectedPromotion.value
    )
  }
  const secondFilter = filterDiscount
    .filter(
      (promotion) =>
        promotion.status === 'published' &&
        promotion.eventType === 'promotion' &&
        promotion.dist?.calculated < eventStore.radioLocation &&
        ((promotion.userId?.isActive && promotion.userId?.isValidated) ||
          promotion.userId?.role === 'admin')
    )
    .sort((a, b) => {
      const priorityA = getPromoPriority(a)
      const priorityB = getPromoPriority(b)

      if (priorityA !== priorityB) {
        return priorityB - priorityA
      }
      return compareDates(a.eventDate, b.eventDate)
    })

  return secondFilter
})

function getPromoPriority(promotion) {
  const subscriptionName = promotion.subscription.name

  let priority
  if (subscriptionName === 'optima') {
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
  return dateA.day - dateB.day
}

function handleTabChange(tab) {
  selectTabOption.value = tab
}
</script>
