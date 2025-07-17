<template>
  <div class="lg:px-6 w-full">
    <div class=" ">
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
    <div v-if="showSeeMoreButton" class="flex w-full items-center mt-4">
      <div class="border-t border-primary/50 flex-1"></div>
      <div
        @click="handleNumberViewPages"
        ref="verButton"
        class="flex justify-center items-center gap-x-4 border border-primary/60 h-8 w-full rounded-xl w-[60vw] xs:w-[40vw] w-[20vw] cursor-pointer hover:border-primary p-5"
      >
        <span
          v-if="!reverseViewPages"
          class="text-black font-semibold"
          :class="{ 'text-white': theme === 'dark' }"
          >{{ $t('buttons.seeMore') }}</span
        >
        <span
          v-else
          class="text-black font-semibold"
          :class="{ 'text-white': theme === 'dark' }"
          >Ver menos</span
        >
        <img
          :src="theme === 'dark' ? '/arrow-down.png' : '/arrow-down-black.png'"
          :class="[
            'w-3 h-3 mt-1 transition-transform',
            { 'rotate-180': reverseViewPages },
          ]"
          alt="arrow"
        />
      </div>
      <div class="border-t border-primary/50 flex-1"></div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, nextTick } from 'vue'
const eventStore = useEventStore()
const userStore = useUserStore()
const paymentStore = usePaymentStore()
const theme = computed(() => userStore?.themePreference)

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
  selectedGenres,
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
    !selectedGenres.length &&
    selectedEventFilter.value === 'all' &&
    musicFilter.value === 'all' &&
    selectedFilterByDate.value === 'all' &&
    !searchQuery.value
  )
}

const shouldApplyProximityFilter = computed(() => {
  return userStore?.acceptedGeolocation && !filters.value.islands?.length
})

const showSeeMoreButton = computed(() => {
  return isPaginatedView.value
})

const isPaginatedView = computed(() => {
  // La paginación solo se activa si TODAS estas condiciones son verdaderas
  const noDateFilters =
    !filters.value.date && !filters.value.startTime && !filters.value.endTime
  const noListFilters =
    !filters.value.islands?.length &&
    !selectedCategories.value?.length &&
    !selectedGenres.value?.length
  const noDropdownFilters =
    selectedEventFilter.value === 'all' &&
    musicFilter.value === 'all' &&
    selectedFilterByDate.value === 'all'
  const noSearch = !searchQuery.value
  const hasEnoughEvents = shuffledEvents.value.length > 9
  return (
    noDateFilters &&
    noListFilters &&
    noDropdownFilters &&
    noSearch &&
    hasEnoughEvents
  )
})

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

  if (shouldApplyProximityFilter.value) {
    const nearbyEvents = filterEvents.filter(
      (event) => event.dist?.calculated < eventStore.radioLocation
    )

    if (nearbyEvents.length > 0) {
      filterEvents = nearbyEvents
    }
  }

  if (
    eventStore?.selectedGenres?.length > 0 &&
    !eventStore?.selectedGenres?.includes('all')
  ) {
    // Solo mostrar eventos que coincidan con los géneros seleccionados
    filterEvents = filterEvents.filter((event) =>
      eventStore?.selectedGenres?.includes(event?.musicType)
    )
 
  } else if (eventStore?.selectedGenres?.includes('all')) {
    filterEvents = filterEvents.filter((event) => {
      if (!event.categories || !Array.isArray(event.categories)) {
        return false
      }
      const ids = event.categories.map((cat) => cat._id)
      const found = ids.includes('6702ad06009a63bba556a1f3')
      return found
    })
  }
  if (searchQuery?.value?.trim()) {
    const text = searchQuery?.value?.toLowerCase()
    filterEvents = filterEvents.filter((event) => {
      const title = event?.eventName?.toLowerCase()
      return title?.includes(text)
    })
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

const screenWidth = ref(window.innerWidth)
const isLargeScreen = ref(screenWidth.value > 425)

const updateWidth = () => {
  screenWidth.value = window.innerWidth
}

watch(screenWidth, (newWidth) => {
  isLargeScreen.value = newWidth > 425
})

onMounted(() => {
  updateWidth()
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})

let numberViewPages = ref(9)
let reverseViewPages = ref(false)
const verButton = ref(null)

const displayEvents = computed(() => {
  if (isPaginatedView.value) {
    return shuffledEvents.value.slice(0, numberViewPages.value)
  }
  return shuffledEvents.value
})

const handleNumberViewPages = () => {
  if (
    numberViewPages.value <= shuffledEvents.value.length &&
    !reverseViewPages.value
  ) {
    numberViewPages.value += 24
    if (numberViewPages.value >= shuffledEvents.value.length) {
      numberViewPages.value = shuffledEvents.value.length
      reverseViewPages.value = true
    }
  } else {
    reverseViewPages.value = false
    numberViewPages.value = 9

    nextTick(() => {
      const el = verButton.value
      if (el) {
        const rect = el.getBoundingClientRect()
        let yOffset = null
        if (screenWidth.value < 640) {
          yOffset = 3500
        } else if (screenWidth.value >= 640 && screenWidth.value < 1024) {
          yOffset = 2000
        } else {
          yOffset = 1230
        }
        const scrollToY = window.pageYOffset + rect.bottom - yOffset

        window.scrollTo({ top: scrollToY, behavior: 'auto' })
      }
    })
  }
}

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
