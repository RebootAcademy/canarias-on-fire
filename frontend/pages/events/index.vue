<template>
  <div class="flex flex-col items-center bg-background">
    <Hero class="hidden sm:flex" />
    <div class="w-full mt-8 md:mt-0 px-4 sm:w-2/3">
      <div
        class="flex flex-col gap-2 md:flex-row md:gap-0 items-center justify-between w-full px-4 mb-4"
      >
        <div class="flex w-full items-start">
          <h2
            class="text-2xl md:text-3xl font-semibold text-primary mb-4 md:mb-0"
          >
            {{ $t('events') }}
          </h2>
        </div>
        <div class="flex gap-4 items-center">
          <SearchInput v-model="searchQuery" />
          <CustomBtn :title="$t('filterBtn')" @click="openFilterModal" />
          <FilterModal />
        </div>
      </div>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
      >
        <EventCard
          v-for="event in limitedEvents"
          :key="event._id"
          :event="event"
        />
      </div>
      <p v-if="limitedEvents.length === 0" class="text-secondary mt-4">
        {{ $t('notEventsFound') }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
const userStore = useUserStore()
const eventStore = useEventStore()
const paymentStore = usePaymentStore()

const { filteredEvents } = storeToRefs(eventStore)

onMounted(() => {
  eventStore.resetFilters()
})

const searchQuery = computed({
  get: () => eventStore.searchQuery,
  set: (value) => eventStore.setSearchQuery(value),
})

const openFilterModal = () => {
  eventStore.setFilterModalOpen(true)
}

const limitedEvents = computed(() => {
  return filteredEvents.value
    .filter(
      (event) =>
        event.status === 'published' &&
        event.eventType === 'event' &&
        event.userId?.isActive &&
        event.userId?.isValidated
    )
    .sort((a, b) => {
      const priorityA = getEventPriority(a)
      const priorityB = getEventPriority(b)

      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }

      return compareDates(a.eventDate, b.eventDate)
    })
})

function getEventPriority(event) {
  const paymentId =
    event.eventType === 'event' ? event.payment._id : event.payment
  const payment = paymentStore.getPaymentById(paymentId?._id)
  return payment?.features?.readPriority
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

onMounted(() => {
  userStore.fetchAndSetUser(userStore.userData?.email)
})
</script>
