<template>
  <div class="flex flex-col items-center py-6">
    <div class="flex items-center w-full gap-4">
       <button
        v-for="filter in computedDateFilters" 
        :key="filter.label" 
        class=" relative md:text-xl lg:text-2xl text-grayForeground hover:text-primary active:text-primary"
        @click="handleFilter(filter.value)"
      >
        <span :class="select === filter.value ? 'text-primary' : ''">{{ filter.label }}</span>
        <span
          v-if="select === filter.value"
          class="absolute left-0 right-0 h-[1px] bg-primary"
          style="top: 100%; margin-top: 5px;" 
        ></span>
      </button>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const select = ref('all')
const computedDateFilters = computed(() => [
  { label: t('promoFilters.allPromo'), value: 'all' },
  { label: t('promoFilters.nearPromo'), value: 'nearMe' },
])
const emit = defineEmits(['update:selectedFilter'])

const handleFilter = (value) => {
  select.value = value
  emit('update:selectedFilter', value)
}
</script>
