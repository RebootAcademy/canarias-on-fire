<template>
  <div>
    <div class="flex items-center justify-between w-full px-4 mb-4">
      <h2 class="text-xl font-semibold">Events</h2>
      <div class="flex gap-4">
        <SearchInput />
        <Button class="text-sm px-3">
          {{ $t('filterBtn') }}
        </Button>
      </div>
    </div>
    <hr class="mb-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
      <EventCard 
        v-for="event in filteredEvents" 
        :key="event._id" 
        :event="event" 
        class="flex-shrink-0"
      />
    </div>
    <p v-if="filteredEvents.length === 0" class="text-gray-500 mt-4">No se encontraron eventos.</p>
  </div>
</template>

<script setup>
import { useEventStore } from '../../stores/eventStore'

const eventStore = useEventStore()

definePageMeta({
  layout: 'dashboard'
})

const { data, error, refresh } = useAsyncData('events', () => 
    $fetch('http://localhost:8080/api/events')
  )

const events = ref(data.value?.result || [])

console.log(events.value)

const filteredEvents = computed(() => {
  const eventsToFilter = events.value.length > 0 ? events.value : eventStore.events
  if (!eventStore.selectedCategory) {
    return eventsToFilter
  }
  return eventsToFilter.filter(event => 
    event.categories.some(category => category.name === eventStore.selectedCategory)
  )
})

</script>
