<template>
  <div>
    <div class="flex items-center justify-between w-full px-4 mb-4">
      <h2 class="text-xl font-semibold">Events</h2>
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
        v-for="event in filteredEvents"
        :key="event._id"
        :event="event"
      />
    </div>
    <p v-if="filteredEvents.length === 0" class="text-gray-500 mt-4">
      No se encontraron eventos.
    </p>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'

const eventStore = useEventStore()
const { filteredEvents } = storeToRefs(eventStore)

definePageMeta({
  layout: 'dashboard',
})

onMounted(() => {
  eventStore.resetFilters()
})

const searchQuery = computed({
  get: () => eventStore.searchQuery,
  set: (value) => eventStore.setSearchQuery(value)
})

const openFilterModal = () => {
  eventStore.setFilterModalOpen(true)
}

</script>
