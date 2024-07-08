<template>
  <div class="flex justify-evenly mt-4">
    <div 
      v-for="category in categories" 
      :key="category._id"
      class="flex flex-col items-center cursor-pointer"
      @click="selectCategory(category)"
    >
    <span class="text-xs mb-1">{{ $t(`values.${category.name}`) }}</span>
    <div
      :class="{
        'bg-black text-white': isSelected(category),
        'bg-white text-black': !isSelected(category)
      }"
      class="flex flex-col items-center justify-center rounded-full border-2 w-20 h-20 hover:bg-slate-200"
    >
      <component :is="category.icon" class="w-8 h-8" />
    </div>
    </div>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'
import { icons } from 'lucide-vue-next'

const config = useRuntimeConfig()
const eventStore = useEventStore()

const { data, error } = await useAsyncData('categories', () => $fetch(`${config.public.apiBaseUrl}/categories`, {
  method: 'GET'
})) 

if (error.value) {
  console.error('Error getting categories from database:', error.value)
} else {
  // console.log('Categories fetched from databse', data.value)
}

const categories = data.value?.result.map(category => ({
  ...category,
  icon: icons[category.icon]
})) || []

const selectCategory = (category) => {
  if (eventStore.selectedCategory === category.name) {
    eventStore.selectedCategory = null
  } else {
    eventStore.selectedCategory = category.name
  }
}

const isSelected = (category) => {
  return eventStore.selectedCategory === category.name
}

</script>
