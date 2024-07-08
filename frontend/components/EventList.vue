<template>
  <div class="flex flex-col items-center px-10">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 w-full">
      <EventCard 
        v-for="event in filteredEvents" 
        :key="event._id" 
        :event="event" 
      />
    </div>
    <p v-if="filteredEvents.length === 0" class="text-gray-500 mt-4">No se encontraron eventos.</p>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()

const props = defineProps({
  events: {
    type: Array,
    default: () => []
  }
})

const filteredEvents = computed(() => {
  const eventsToFilter = props.events.length > 0 ? props.events : eventStore.events
  if (!eventStore.selectedCategory) {
    return eventsToFilter
  }
  return eventsToFilter.filter(event => 
    event.categories.some(category => category.name === eventStore.selectedCategory)
  )
})

</script>