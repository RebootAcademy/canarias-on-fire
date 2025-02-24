<template>
  <div class="events-related">
    <h2 class="text-xl font-semibold mb-4">{{ type === 'event' ? $t('relatedEvent') : $t('relatedPromotion')}}</h2>
    <div v-if="type === 'event'" class="flex customScrollBar overflow-x-auto pb-4 space-x-4">
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

const props = defineProps({
  type: {
    type: String,
    required: true,
  }
})


const eventStore = useEventStore()
const { events, event } = storeToRefs(eventStore)

// Obtener las categorías del evento actual
const currentEventCategories = computed(() => {
  return event.value?.categories || []
})

// Filtrar eventos relacionados basados en las categorías del evento actual
const relatedEvents = computed(() => {
  if (!currentEventCategories.value.length) return []

   return events.value.filter(e => 
    e._id !== event.value._id && e.status === 'published' &&
    e.categories.some(cat => 
      currentEventCategories.value.some(currentCat => currentCat._id === cat._id )
    )
  ).slice(0, 6) // Limitar a 5 eventos relacionados
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
