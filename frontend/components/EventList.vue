<template>
  <div class="lg:px-6 w-full">
    <!-- Grid de tarjetas de eventos -->
    <div
      class="grid justify-items-center items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-4"
    >
      <EventCard
        v-for="event in displayEvents"
        :key="event._id"
        :event="event"
        class="xs:w-[80%] sm:w-full"
      />
    </div>

    <!-- Mensaje si no hay eventos -->
    <p v-if="filteredByType.length === 0" class="text-gray-500 mt-4">
      {{ $t('notEventsFound') }}
    </p>

    <!-- Botón "Ver más" -->
    <div v-if="showSeeMoreButton" class="flex w-full items-center mt-4">
      <div class="border-t border-primary/50 flex-1"></div>
      <div
        @click="handleNumberViewPages"
        ref="verButton"
        class="flex justify-center items-center gap-x-4 border border-primary/60 h-8 w-full rounded-xl w-[60vw] xs:w-[40vw] w-[20vw] cursor-pointer hover:border-primary p-5"
      >
        <span
          :class="[
            'text-black font-semibold',
            { 'text-white': theme === 'dark' },
          ]"
        >
          {{ reverseViewPages ? 'Ver menos' : $t('buttons.seeMore') }}
        </span>
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import {
  getIslandFromPostalCode,
  getDistanceFromLatLonInKm,
  getIslandFromCoordinates,
} from '../utils/locationUtils'

const eventStore = useEventStore()
const userStore = useUserStore()
const paymentStore = usePaymentStore()
const theme = computed(() => userStore?.themePreference)
const {
  filters,
  filteredAndSortedEvents,
  selectedCategories,
  selectedGenres,
  selectedEventFilter,
  musicFilter,
  selectedFilterByDate,
  searchQuery,
} = storeToRefs(eventStore)

const props = defineProps({
  type: String,
})

const filteredByType = computed(() => {
  if (!props.type) return filteredAndSortedEvents.value

  if (props.type === 'kids') {
    return filteredAndSortedEvents.value.filter(
      (event) =>
        Array.isArray(event.categories) &&
        event.categories.some((cat) => cat._id === '6702ad49009a63bba556a1f4')
    )
  }

  return filteredAndSortedEvents.value
})

// 🔹 Número de eventos a mostrar y control de paginación
const numberViewPages = ref(9)
const reverseViewPages = ref(false)
const verButton = ref(null)

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// 🔹 Paginación
const displayEvents = computed(() => {
  const shouldPaginate = isPaginatedView.value

  return shouldPaginate
    ? reverseViewPages.value
      ? shuffledEvents.value
      : shuffledEvents.value.slice(0, numberViewPages.value)
    : shuffledEvents.value
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
  const noProps = !props.type
  return (
    noDateFilters &&
    noListFilters &&
    noDropdownFilters &&
    noSearch &&
    hasEnoughEvents &&
    noProps
  )
})

// 🔹 Ver más / Ver menos
const handleNumberViewPages = () => {
  if (
    numberViewPages.value < filteredAndSortedEvents.value.length &&
    !reverseViewPages.value
  ) {
    numberViewPages.value += 24
    if (numberViewPages.value >= filteredAndSortedEvents.value.length) {
      reverseViewPages.value = true
    }
  } else {
    reverseViewPages.value = false
    numberViewPages.value = 9

    nextTick(() => {
      const el = verButton.value
      if (el) {
        const rect = el.getBoundingClientRect()
        const yOffset =
          window.innerWidth < 640
            ? 3500
            : window.innerWidth < 1024
            ? 2000
            : 1230
        const scrollToY = window.pageYOffset + rect.bottom - yOffset
        window.scrollTo({ top: scrollToY, behavior: 'auto' })
      }
    })
  }
}

const shuffledEvents = computed(() => {
  function getEventPriority(event) {
    const paymentId =
      event.type === 'event' ? event.payment?._id : event.payment
    const payment = paymentStore.getPaymentById(paymentId?._id)
    return payment?.features?.readPriority
  }

  const priorities = {
    3: [],
    2: [],
    1: [],
  }
  const noPriority = []

  filteredByType.value.forEach((event) => {
    const priority = getEventPriority(event)
    if (priority && priorities[priority]) {
      priorities[priority].push(event)
    } else {
      noPriority.push(event)
    }
  })

  return [
    ...shuffleArray(priorities[3]),
    ...shuffleArray(priorities[2]),
    ...shuffleArray(priorities[1]),
    ...shuffleArray(noPriority),
  ]
})
</script>

<style scoped>
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}
</style>
