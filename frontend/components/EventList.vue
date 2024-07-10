<template>
  <div class="px-10">
    <div class="overflow-x-auto">
      <div class="flex space-x-8 pb-4">
        <EventCard 
          v-for="event in filteredEvents" 
          :key="event._id" 
          :event="event" 
          class="flex-shrink-0"
        />
      </div>
    </div>
    <p v-if="filteredEvents.length === 0" class="text-gray-500 mt-4">No se encontraron eventos.</p>
  </div>
</template>

<script setup>
import { useEventStore } from '../../stores/eventStore'

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

<style scoped>
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}
</style>