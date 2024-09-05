<template>
  <div class="flex flex-col items-center bg-black">
    <Hero />
    <div class="w-2/3">
      <div class="flex items-center justify-between w-full px-4 mb-4">
        <h2 class="text-3xl font-semibold text-primary">{{ $t('events') }}</h2>
        <div class="flex gap-4">
          <SearchInput v-model="searchQuery" />
          <CustomBtn
            :title="$t('filterBtn')"
            @click="openFilterModal"
          />
            <!-- <Button @click="openFilterModal" variant="ghost" class="text-sm px-3 bg-black  ">
              {{ $t('filterBtn') }}
            </Button> -->

      
          <FilterModal />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        <EventCard
          v-for="event in filteredEvents"
          :key="event._id"
          :event="event"
        />
      </div>
      <p v-if="filteredEvents.length === 0" class="text-gray-500 mt-4">
       {{ $t('notEventsFound')}}
      </p>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'

const eventStore = useEventStore()
const { filteredEvents } = storeToRefs(eventStore)

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
