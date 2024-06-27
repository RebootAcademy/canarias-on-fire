<template>
  <div class="flex flex-col gap-2">
    <p class="font-semibold">Tags</p>
    <p class="text-xs text-gray-500 mb-2">Choose up to five tags that best describe your event. These categories will help users quickly understand the type and focus of your event.</p>
    <div class="flex flex-wrap gap-2 p-2 mb-4">
      <Badge 
        v-for="category in categories"
        :key="category._id"
        :class="{'bg-blue-500' : isSelected(category), 'bg-white' : !isSelected(category)}"
        @click="toggleCategory(category)"
        variant="secondary"
        class="p-2 px-4 cursor-pointer"
      >{{ category.name }}</Badge>
    </div>
  </div>
  <hr class="mb-4">
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()
const config = useRuntimeConfig()

const { data, error } = await useAsyncData('categories', () => $fetch(`${config.public.apiBaseUrl}/categories`, {
  method: 'GET'
})) 

if (error.value) {
  console.error('Error geting categories from database:', error.value)
} else {
  // console.log('Categories fetched from databse', data.value)
}

const categories = data.value?.result || []

const toggleCategory = (category) => {
  eventStore.toggleCategory(category)
}

const isSelected = (category) => {
  return eventStore.selectedCategories.some(c => c._id === category._id)
}

</script>
