<template>
  <div class="flex flex-col items-center p-6">
    <div class="flex items-center w-full gap-4">
       <button
        v-for="filter in computedDateFilters" 
        :key="filter.label" 
        class="relative text-gray-500 hover:text-primary active:text-primary"
        @click="activeDateFilter(filter.value)"
        
      >
        <span :class="eventStore.selectedFilterByDate === filter.value ? 'text-primary' : ''">{{ filter.label }}</span>
        <span
          v-if="eventStore.selectedFilterByDate === filter.value"
          class="absolute left-0 right-0 h-[1px] bg-primary"
          style="top: 100%; margin-top: 5px;" 
        ></span>
      </button>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const computedDateFilters = computed(() => [
  { label: t('dateFilters.all'), value: 'all' },
  { label: t('dateFilters.today'), value: 'today' },
  { label: t('dateFilters.weekend'), value: 'weekend' },
  { label: t('dateFilters.month'), value: 'month' }
])
const eventStore = useEventStore()

const activeDateFilter = (date) => {
  eventStore.selectedFilterByDate = date
}
</script>
