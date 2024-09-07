<template>
  <div class="flex flex-col items-center p-6">
    <div class="flex items-center w-full gap-4">
       <button
        v-for="filter in computedDateFilters" 
        :key="filter.label" 
        class="text-gray-500 hover:text-primary active:text-primary"
        @click="activeDateFilter(filter.value)"
        :class=" eventStore.selectedFilterByDate === filter.value ? 'text-primary' : ''"
      >
        {{ filter.label }}
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
