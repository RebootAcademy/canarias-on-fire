<template>
  <div class="flex justify-evenly p-3">
    <div 
      v-for="category in categories" 
      :key="category._id"
      class="flex flex-col items-center justify-center rounded-full border-2 w-24 h-24 hover:bg-slate-200"
    >
      <component :is="category.icon" class="w-8 h-8"/>
      <span class="text-xs">{{ category.name }}</span>
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

</script>