<template>
  <div class="flex w-full h-full">
    <div class="bg-blue-900 w-1/2"></div>
    <div class="bg-blue-100 w-1/2 p-4">

      <header class="text-lg font-bold">Create a new Event</header>

      <div class="flex flex-col mt-4 gap-4">
        <div class="flex flex-col gap-2">
          <div class="font-semibold">Select category</div>
          <div class="flex flex-wrap gap-2">
            <Badge 
              v-for="category in categories"
              :key="category.id"
              :class="{'bg-blue-500' : isSelected(category), 'bg-white' : !isSelected(category)}"
              @click="toggleCategory(category)"
              variant="secondary"
              class="p-2 px-4 cursor-pointer"
            >{{ category.name }}</Badge>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="font-semibold">Event info</div>
        </div>
      </div>
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
  console.log('Categories fetched from databse', data.value)
}

const categories = data.value?.result || []

watch(() => {
  console.log(eventStore.selectedCategories)
})

const toggleCategory = (category) => {
  eventStore.toggleCategory(category)
}

const isSelected = (category) => {
  return eventStore.selectedCategories.some(c => c._id === category._id)
}

</script>

