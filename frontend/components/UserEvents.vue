<template>
  <div>
    <div class="flex items-center justify-between w-full px-4 mb-4 mt-6">
      <h2 class="text-xl font-semibold">Events for {{ user.companyName || user.username }}</h2>
      <div class="flex gap-4">
        <SearchInput v-model="searchQuery" />
        <Button @click="openFilterModal" class="text-sm px-3">
          {{ $t('filterBtn') }}
        </Button>
        <FilterModal />
      </div>
    </div>
    <hr class="mb-4" />
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
    >
      <EventCard
        v-for="event in filteredUserEvents"
        :key="event._id"
        :event="event"
      />
    </div>
    <p v-if="filteredUserEvents.length === 0" class="text-gray-500 mt-4">
      No se encontraron eventos.
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  user: {
    type: String,
    required: true
  }
})

const eventStore = useEventStore()
const events = ref([])
const searchQuery = ref('')

onMounted(async () => {
  try {
    await eventStore.fetchUserEvents(props.user._id)
    events.value = eventStore.userEvents
  } catch (error) {
    console.error('Error fetching user events:', error)
  }
})

const openFilterModal = () => {
  eventStore.setFilterModalOpen(true)
}

const filteredUserEvents = computed(() => {
  return eventStore.userEvents.filter(event => {
    if (searchQuery.value) {
      const lowercaseQuery = searchQuery.value.toLowerCase()
      if (!event.eventName.toLowerCase().includes(lowercaseQuery) &&
      !event.eventDescription.toLowerCase().includes(lowercaseQuery)) {
        return false
      }
    }
    // Add more filtering logic here if needed
    return true
  })
})

watch(searchQuery, (newQuery) => {
  eventStore.setSearchQuery(newQuery)
})

</script>
