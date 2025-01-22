<template>
  <div class="flex flex-col items-center bg-background">
    <Hero class="hidden sm:flex" />
    <div class="w-full mt-8 md:mt-0 px-4 sm:w-2/3">
      <div
        class="flex flex-col gap-2 md:flex-row md:gap-0 items-center justify-between w-full px-4 mb-4"
      >
        <div class="flex w-full items-start">
          <h2
            class="text-2xl lg:text-[38px] font-bold text-primary mb-4 md:mb-0"
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
      <div>
        <InfoLocation v-if="!userStore.acceptedGeolocation" class="my-4 mt-6"/>
        <div class="flex flex-col justify-center w-full md:justify-start md:w-1/3 mb-6">
          <EventFilter v-if="userStore.acceptedGeolocation"/>
          <GeolocationMap  v-if="eventStore.selectedEventFilter === 'nearby'"/>
        </div>
        <div
         
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
        >
          <EventCard
            v-for="event in limitedEvents"
            :key="event._id"
            :event="event"
            :nearby="eventStore.selectedEventFilter === 'all'"
          />
        </div>
        <p v-if="limitedEvents.length === 0" class="text-secondary mt-4">
          {{ $t('notEventsFound') }}
        </p>
      </div>
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
  let firstFilter 

  if (eventStore.selectedEventFilter === 'nearby') {
    firstFilter = filteredEvents.value
      .filter(
        (event) =>
          event.status === 'published' &&
        event.eventType === 'event' &&
         event.dist?.calculated < eventStore.radioLocation &&
        ((event.userId?.isActive &&
        event.userId?.isValidated) || event.userId?.role === 'admin')
      )
  } else  {
    firstFilter = filteredEvents.value.filter(
      (event) =>
        event.status === 'published' &&
        event.eventType === 'event' &&
        ((event.userId?.isActive &&
        event.userId?.isValidated) || event.userId?.role === 'admin')
    )
  }


  return firstFilter
    .sort((a, b) => {
      const priorityA = getEventPriority(a) || null;
      const priorityB = getEventPriority(b) || null;
      if ((!priorityA && priorityB) || (priorityA > priorityB)) {
        return 1; // Coloca los eventos sin "paymentId" al final
      }
      if ((priorityA && !priorityB) || (priorityA < priorityB)) {
        return -1; // Coloca los eventos con "paymentId" al principio
      }

      // return compareDates(a.eventDate, b.eventDate)
      return Math.random() - 0.5;
    })
})

function getEventPriority(event) {
  return event.payment?.features?.readPriority
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

onMounted(async() => {
  await userStore.fetchAndSetUser(userStore.userData?.email)
})
</script>
