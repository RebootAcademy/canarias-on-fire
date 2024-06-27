<template>
  <div class="flex justify-evenly mt-4">
    <div 
      v-for="category in categories" 
      :key="category._id"
      class="flex flex-col items-center"
    >
    <span class="text-xs mb-1">{{ capitalizeFirstLetter(category.name) }}</span>
    <div class="flex flex-col items-center justify-center rounded-full border-2 w-20 h-20 hover:bg-slate-200">
      <component :is="category.icon" class="w-8 h-8"/>
    </div>
    </div>
  </div>
</template>

<script setup>
import { icons } from 'lucide-vue-next'

const config = useRuntimeConfig()

const { data, error } = await useAsyncData('categories', () => $fetch(`${config.public.apiBaseUrl}/categories`, {
  method: 'GET'
})) 

if (error.value) {
  console.error('Error geting categories from database:', error.value)
} else {
  // console.log('Categories fetched from databse', data.value)
}

const categories = data.value?.result.map(category => ({
  ...category,
  icon: icons[category.icon]
})) || []

const capitalizeFirstLetter = (string) => {
  return string.split(/(\W)/).map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join('')
}

</script>