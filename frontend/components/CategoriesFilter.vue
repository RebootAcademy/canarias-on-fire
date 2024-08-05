<template>
  <div class="flex justify-evenly flex-wrap gap-2.5">
    <div
      v-for="category in categories"
      :key="category.id"
      class="flex flex-col items-center cursor-pointer p-2.5 rounded-lg transition-colors duration-300"
      :class="{ 'bg-gray-200': isSelected(category) }"
      @click="toggleCategory(category)"
    >
      <component :is="getIcon(category.icon)" class="w-6 h-6" />
      <span class="mt-1.5 text-xs">{{ $t(`values.${category.name}`) }}</span>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import * as LucideIcons from 'lucide-vue-next'

const eventStore = useEventStore()
const { categories, selectedCategories } = storeToRefs(eventStore)

const getIcon = (iconName) => {
  return LucideIcons[iconName] || LucideIcons.HelpCircle
}

const isSelected = (category) => {
  return selectedCategories.value.some(c => c.id === category.id)
}

const toggleCategory = (category) => {
  eventStore.toggleCategory(category)
}
</script>