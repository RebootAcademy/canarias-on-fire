<template>
  <div
    class="w-full grid justify-items-center items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-4"
  >
    <PromotionCard
      v-for="promotion in limitedPromotions"
      :key="promotion._id"
      :promotion="promotion"
    />
  </div>
  <div v-if="limitedPromotions?.length === 0" class="inline-block text-gray-500 mt-4">
    {{ $t('notPromotionsFound') }}
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
const eventStore = useEventStore()
const {t} = useI18n()
const props = defineProps({
  filteredOption: { type: String, default: '' },
})

const { filteredEvents } = storeToRefs(eventStore)

const limitedPromotions = computed(() => {
  console.log('prop', props.filteredOption)
  let filteredPromotions = filteredEvents.value

  if (props.filteredOption) {
    filteredPromotions = filteredEvents.value.filter((event) =>
      event.categories.some((category) =>
        category.name
          .toLowerCase()
          .includes(props.filteredOption.toLowerCase())
      )
    )
  }

  return filteredPromotions
    .filter(
      (promotion) =>
        promotion.status === 'published' &&
        promotion.eventType === 'promotion' &&
        promotion.userId?.isActive &&
        promotion.userId?.isValidated
    )
    .sort((a, b) => {
      const priorityA = getPromoPriority(a)
      const priorityB = getPromoPriority(b)

      if (priorityA !== priorityB) {
        return priorityB - priorityA
      }
      return compareDates(a.eventDate, b.eventDate)
    })
    .slice(0, 9)
})

function getPromoPriority(promotion) {
  const subscriptionName = promotion.subscription.name

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
