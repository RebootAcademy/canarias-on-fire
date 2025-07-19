<template>
  <div class="events-related">
    <h2 class="text-xl font-semibold mb-4">
      {{ relatedTitle }}
    </h2>
    <div
      v-if="promotionsNearList.length > 0"
      class="flex customScrollBar overflow-x-auto pb-4 space-x-4"
    >
      <PromotionCard
        v-for="promo in promotionsNearList"
        :key="promo._id"
        :promotion="promo"
        :isRelatedPromo="true"
        class="flex-shrink-0 w-74 overflow-x-hidden"
      />
    </div>
    <div
      v-else-if="type === 'event'"
      class="flex customScrollBar overflow-x-auto pb-4 space-x-4"
    >
      <EventCard
        v-for="event in relatedEvents"
        :key="event._id"
        :event="event"
        :isRelatedEvent="true"
        class="flex-shrink-0 w-74 overflow-x-hidden"
      />
    </div>
    <div v-else class="flex customScrollBar overflow-x-auto pb-4 space-x-4">
      <PromotionCard
        v-for="promo in relatedEvents"
        :key="promo._id"
        :promotion="promo"
        :isRelatedPromo="true"
        class="flex-shrink-0"
      />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { getDistanceFromLatLonInKm } from '@/utils/locationUtils'
const { t } = useI18n()
const props = defineProps({
  type: {
    type: String,
    required: true,
  },
})

const eventStore = useEventStore()
const { events, event } = storeToRefs(eventStore)

// Obtener las categorías del evento actual
const currentEventCategories = computed(() => {
  return event.value?.categories || []
})

// Filtrar eventos relacionados basados en las categorías del evento actual
const relatedEvents = computed(() => {
  if (
    !Array.isArray(events.value) ||
    !Array.isArray(currentEventCategories.value) ||
    currentEventCategories.value.length === 0
  )
    return []

  return events.value
    .filter(
      (e) =>
        e._id !== event.value._id &&
        e.status === 'published' &&
        e.categories.some((cat) =>
          currentEventCategories.value.some(
            (currentCat) => currentCat.id === cat._id
          )
        )
    )
    .slice(0, 6) // Limitar a 5 eventos relacionados
})

// Filtrar promociones de restaurantes
const currentPromotionRestaurants = computed(() => {
  const validSectors = ['restoration', 'nightlife', 'hotels']

  if (!Array.isArray(events.value)) return []

  const filtered = events.value.filter(
    (event) =>
      event.eventType === 'promotion' &&
      event.status !== 'closed' &&
      (event.userId?.role === 'admin' ||
        validSectors.some((sector) => event.userId?.sector?.includes(sector)))
  )

  const sorted = filtered.sort((a, b) => {
    if (a.userId?.role === 'admin' && b.userId?.role !== 'admin') return -1
    if (b.userId?.role === 'admin' && a.userId?.role !== 'admin') return 1

    const sectorA =
      validSectors.find((s) => a.userId?.sector?.includes(s)) || ''
    const sectorB =
      validSectors.find((s) => b.userId?.sector?.includes(s)) || ''

    return validSectors.indexOf(sectorA) - validSectors.indexOf(sectorB)
  })

  return sorted
})

// Filtrar promociones de otros sectores
const currentPromotionOthers = computed(() => {
  const validSectors = ['activities', 'promoter', 'services']

  if (!Array.isArray(events.value)) return []

  // Obtener ids de eventos que ya están en currentPromotionRestaurants
  const restaurantIds = new Set(
    currentPromotionRestaurants.value.map((e) => e._id)
  )

const filtered = events.value.filter(
  (event) =>
    event.eventType === 'promotion' &&
    event.status !== 'closed' &&
    (
      event.userId?.role === 'admin' ||
      validSectors.some((sector) => event.userId?.sector?.includes(sector))
    ) &&
    !restaurantIds.has(event._id)
)

  const sorted = filtered.sort((a, b) => {
    if (a.userId?.role === 'admin' && b.userId?.role !== 'admin') return -1
    if (b.userId?.role === 'admin' && a.userId?.role !== 'admin') return 1

    const sectorA =
      validSectors.find((s) => a.userId?.sector?.includes(s)) || ''
    const sectorB =
      validSectors.find((s) => b.userId?.sector?.includes(s)) || ''

    return validSectors.indexOf(sectorA) - validSectors.indexOf(sectorB)
  })

  return sorted
})

// Filtrar eventos de promoción basados en el tipo de evento
const currentPromotionEvents = computed(() => {
  return events.value.filter((event) => event.eventType === 'promotion') || []
})

// Filtrar promociones cercanas basadas en la ubicación del evento actual
const promotionsNearList = computed(() => {
  if (
    !event.value ||
    !event.value.eventLocation ||
    !event.value.eventLocation.coordinates
  ) {
    return []
  }
  const [long1, lat1] = event.value.eventLocation.coordinates
  const currentPromotions = [
    ...currentPromotionRestaurants.value,
    ...currentPromotionOthers.value,
  ]

  return currentPromotions.filter((promo) => {
    const [long2, lat2] = promo.eventLocation.coordinates
    const distance = getDistanceFromLatLonInKm(lat1, long1, lat2, long2)
    return distance <= 20 // Filtrar promociones dentro de 20 km
  })
})

const relatedTitle = computed(() => {
  return promotionsNearList.value.length === 0
    ? t('relatedEvent')
    : t('relatedBarPromotion')
})
</script>

<style scoped>
.customScrollBar {
  cursor: pointer;
}

.customScrollBar::-webkit-scrollbar {
  width: 3px;
  height: 12px;
}

.customScrollBar::-webkit-scrollbar-track {
  background: none; /* Color del fondo del track */
}

.customScrollBar::-webkit-scrollbar-thumb {
  background-color: #fbb03b; /* Color del thumb (la parte que se arrastra) */
  border-radius: 10px; /* Redondeo del thumb */
}

.customScrollBar::-webkit-scrollbar-thumb:hover {
  background: #f15a24; /* Color del thumb al hacer hover */
}
</style>
