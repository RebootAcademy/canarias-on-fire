<template>
  <div class="px-6">
    <div class="overflow-x-auto">
      <div class="flex space-x-8 pb-4">
        <EventCard 
          v-show="event.status === 'published'"
          v-for="event in filteredEvents" 
          :key="event._id" 
          :event="event" 
          class="flex-shrink-0"
        />
      </div>
    </div>
    <p v-if="filteredEvents.length === 0" class="text-gray-500 mt-4">{{ $t('notEventsFound')}}</p>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'

const eventStore = useEventStore()
const { filteredEvents } = storeToRefs(eventStore)

</script>

<style scoped>
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}
</style>