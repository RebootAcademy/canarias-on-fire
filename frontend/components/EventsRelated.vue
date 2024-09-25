<template>
  <div class="events-related">
    <h2 class="text-xl font-semibold mb-4">Related Events</h2>
    <div class="flex overflow-x-auto pb-4 space-x-4">
      <EventCard
        v-for="event in relatedEvents"
        :key="event._id"
        :event="event"
        class="flex-shrink-0 w-64"
      />
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'

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
  ).slice(0, 5) // Limitar a 5 eventos relacionados
})
</script>