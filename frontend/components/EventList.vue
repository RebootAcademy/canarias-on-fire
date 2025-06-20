<template>
  <div class="lg:px-6 w-full">
    <div
      class="w-full grid justify-items-center items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-4"
    >
      <EventCard
        v-for="event in displayEvents"
        :key="event._id"
        :event="event"
        class="xs:w-[80%] sm:w-full"
      />
    </div>
    <p v-if="displayEvents?.length === 0" class="text-gray-500 mt-4">
      {{ $t('notEventsFound') }}
    </p>
    <!-- <div v-if="displayEvents?.length > 8" class="mt-6 text-center">
      <NuxtLink to="/events">
        <Button variant="outline">
          {{ $t('buttons.seeMore') }}
        </Button>
      </NuxtLink>
    </div> -->
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
const eventStore = useEventStore()
const userStore = useUserStore()
const paymentStore = usePaymentStore()
let category = null
const {
  filteredEvents,
  filteredEventsByDate,
  filters,
  selectedEventFilter,
  musicFilter,
  selectedFilterByDate,
  searchQuery,
  selectedCategories,
  categories,
} = storeToRefs(eventStore)
const props = defineProps({
  type: {
    type: String,
    required: false,
    default: 'kids',
  },
})

if (props.type === 'kids') {
  //category = categories.value.filter((category) => category.name === 'kids')
  category = categories.value.filter((category) => category.name === 'kids')
  eventStore.toggleCategory(category[0])
}

const shuffledEvents = ref([])

const shuffleArray = (arr) => {
  return arr.slice().sort(() => Math.random() - 0.5)
}

const eventsByDate = computed(() => {
  return filteredEventsByDate?.value(filteredEvents?.value)
})

const noFilterSelected = () => {
  const { islands, date, startTime, endTime, categories } = filters.value

  return (
    !islands.length &&
    !selectedCategories.value.length &&
    !date &&
    !startTime &&
    !endTime &&
    !categories.length &&
    selectedEventFilter.value === 'all' &&
    musicFilter.value === 'all' &&
    selectedFilterByDate.value === 'all' &&
    !searchQuery.value
  )
}

const limitedEvents = computed(() => {
  if (!eventsByDate.value) {
    return []
  }

  let filterEvents = [...eventsByDate.value]?.filter((event) => {
    return (
      event.status === 'published' &&
      event.eventType === 'event' &&
      ((event.userId?.isActive && event.userId?.isValidated) ||
        event.userId?.role === 'admin')
    )
  })

  if (userStore.acceptedGeolocation) {
    filterEvents = filterEvents.filter(
      (event) => event.dist?.calculated < eventStore.radioLocation
    )
  }

  if (eventStore.musicFilter !== 'all') {
    filterEvents = filterEvents.filter(
      (event) => event.musicType === eventStore.musicFilter
    )
  }

  const eventsWithRandomOrder = filterEvents.map((event) => ({
    ...event,
    randomOrder: Math.random().toFixed(2),
  }))

  return eventsWithRandomOrder.sort((a, b) => {
    // Primero compara las prioridades
    const priorityA = getEventPriority(a) || undefined
    const priorityB = getEventPriority(b) || undefined

    if ((!priorityA && priorityB) || priorityA > priorityB) {
      return 1 // Coloca los eventos sin "paymentId" al final
    }
    if ((priorityA && !priorityB) || priorityA < priorityB) {
      return -1 // Coloca los eventos con "paymentId" al principio
    }

    if (selectedFilterByDate.value !== 'all') {
      return compareDates(a.eventDate, b.eventDate)
    } else {
      return a.randomOrder - b.randomOrder
    }
  })
})


// Random Order By priority Event
watch(
  limitedEvents,
  (newList) => {
    const priorities = {
      3: [],
      2: [],
      1: [],
    }
    const noPriority = []

    newList.forEach((event) => {
      const priority = getEventPriority(event)
      if (priority && priorities[priority]) {
        priorities[priority].push(event)
      } else {
        noPriority.push(event)
      }
    })

    shuffledEvents.value = [
      ...shuffleArray(priorities[3]),
      ...shuffleArray(priorities[2]),
      ...shuffleArray(priorities[1]),
      ...noPriority,
    ]
  },
  { immediate: true }
)

const displayEvents = computed(() => {
  if (noFilterSelected()) {
    return shuffledEvents.value.slice(0, 9)
  }
  return shuffledEvents.value
})

function getEventPriority(event) {
  const paymentId = event.type === 'event' ? event.payment?._id : event.payment
  const payment = paymentStore.getPaymentById(paymentId?._id)
  return payment?.features?.readPriority
}

function compareDates(dateA, dateB) {
  if (dateA.year !== dateB.year) return dateA.year - dateB.year
  if (dateA.month !== dateB.month) return dateA.month - dateB.month
  return dateA.day - dateB.day
}

const displayCategories = computed(() => {
  if (!eventStore.categories) return []
  return filterCategories.value.filter((cat) => cat.type === props.type)
})
</script>

<style scoped>
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}
</style>
