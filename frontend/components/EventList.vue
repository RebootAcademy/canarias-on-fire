<template>
  <div class="flex flex-col items-center px-10">
    <div
        v-for="event in filteredEvents" 
        :key="event._id" 
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 w-full"
      >
      <EventCard :event="event" />
    </div>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()

const filteredEvents = computed(() => {
  if (!eventStore.selectedCategory) {
    return eventStore.events
  }
  return eventStore.events.filter(event => event.category === eventStore.selectedCategory)
})

const props = defineProps({
  events: {
    type: Array
  }
})
</script>