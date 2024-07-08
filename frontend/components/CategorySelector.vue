<template>
  <div class="flex flex-col gap-2">
    <p class="font-semibold">{{ $t('tags') }}</p>
    <p class="text-xs text-gray-500 mb-2">{{ $t('chooseTags') }}</p>
    <div class="flex flex-wrap gap-2 p-2 mb-4">
      <Badge 
        v-for="category in categories"
        :key="category._id"
        :class="{'bg-black text-white' : isSelected(category), 'bg-white' : !isSelected(category)}"
        @click="toggleCategory(category)"
        variant="secondary"
        class="p-2 px-4 cursor-pointer"
      >{{ $t(`values.${category.name}`) }}</Badge>
    </div>
    <span v-if="eventStore.hasTriedSubmit" class="text-red-500 text-xs">{{ errors.categories }}</span>
  </div>
  <hr class="mb-4">
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'
import { errors, validateFields } from '../utils/validation'

const eventStore = useEventStore()
const config = useRuntimeConfig()

const { data, error: fetchError } = await useAsyncData('categories', () => $fetch(`${config.public.apiBaseUrl}/categories`, {
  method: 'GET'
})) 

if (fetchError.value) {
  console.error('Error geting categories from database:', fetchError.value)
} else {
  // console.log('Categories fetched from databse', data.value)
}

const categories = data.value?.result || []

const isSelected = (category) => {
  return eventStore.selectedCategories.some(c => c._id === category._id)
}

const toggleCategory = (category) => {
  const index = eventStore.selectedCategories.findIndex(c => c._id === category._id)
  if (index === -1) {
    eventStore.selectedCategories.push(category)
  } else {
    eventStore.selectedCategories.splice(index, 1)
  }
  validateFields()
}


watch(() => eventStore.selectedCategories)
</script>
