<template>
  <div class="flex flex-col items-center p-6">
    <hr class="w-full border-t border-gray-300 mb-4" />
    <div class="flex items-center justify-between w-full px-4">
      <div>
        <p class="text-2xl font-bold">{{ $t('events') }}</p>
        <p class="text-xs text-gray-500">{{ $t('eventsDesc') }}</p>
      </div>
      <Button @click="openFilterModal">
        <SlidersHorizontal class="mr-2 text-lg" />
        {{ $t('filterBtn') }}
      </Button>
      <FilterModal />
    </div>
    <hr class="w-full border-t border-gray-300 mt-4" />
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'
import { SlidersHorizontal } from 'lucide-vue-next'

const eventStore = useEventStore()

const openFilterModal = () => {
  eventStore.setFilterModalOpen(true)
}
 
</script>
