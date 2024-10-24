<template>
  <div
    class="flex flex-col justify-center items-center bg-background p-8 w-full"
  >
    <div
      v-if="
        selectCategoryForFilterCompany !== 'bands' &&
        selectCategoryForFilterCompany !== 'foodtruck'
      "
      class="w-full grid justify-items-center items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-4"
    >
      <PromotionCard
        v-for="promotion in limitedEvents"
        :key="promotion._id"
        :promotion="promotion"
      />
    </div>
    <div
      v-if="selectCategoryForFilterCompany !== 'bands' && numOfPromotions > 9"
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
    />
  </div>
</template>

<script setup>
const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const paymentStore = usePaymentStore()
const eventStore = useEventStore()
const { selectCategoryForFilterCompany, filteredEvents, filteredEventsByDate } =
  storeToRefs(eventStore)

const numOfPromotions = ref('')

/* const eventsByDate = computed(() => {
  return filteredEventsByDate?.value(filteredEvents?.value)
}) */

const limitedEvents = computed(() => {
  if (!filteredEvents.value) {
    return []
  }

  const firstFilteredEvent = filteredEvents.value?.filter(
    (event) =>
      event.status === 'published' &&
      event.eventType === 'promotion' &&
      (event.categories.some((c) => c.name === 'services') ||
        event.categories.some((c) => c.name === 'food&drinks'))
  )


  let secondFilteredEvent
  if (
    selectCategoryForFilterCompany.value &&
    selectCategoryForFilterCompany.value !== 'all'
  ) {
    secondFilteredEvent = firstFilteredEvent.filter((event) =>
      event.categoriesOfServices.includes(selectCategoryForFilterCompany.value)
    )
  } else {
    secondFilteredEvent = firstFilteredEvent
  }

  return secondFilteredEvent
    .sort((a, b) => {
      const priorityA = getPromoPriority(a)
      const priorityB = getPromoPriority(b)

      if (priorityA !== priorityB) {
        return priorityB - priorityA
      }
      numOfPromotions.value = secondFilteredEvent.length
      return compareDates(a.eventDate, b.eventDate)
    })
    .slice(0, 9)
})

function getPromoPriority(promotion) {
  const subscriptionName = promotion.subscription?.name

  let priority
  if (subscriptionName === 'optima') {
    priority = 2
  } else if (subscriptionName === 'basic') {
    priority = 1
  } else {
    priority = 1
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
</script>
