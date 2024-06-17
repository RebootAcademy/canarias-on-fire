<template>
  <div class="flex flex-col gap-2">
    <div class="font-semibold">Select category</div>
    <div class="flex flex-wrap gap-2">
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
