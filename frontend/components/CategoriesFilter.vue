<template>
  <div class="flex justify-evenly flex-wrap items-center gap-2.5">
    <div
      v-for="category in categories"
      :key="category.id"
      class="flex flex-col items-center cursor-pointer p-2.5 rounded-lg transition-colors duration-300"
      :class="{ 'text-primary': isSelected(category) }"
      @click="toggleCategory(category)"
    >
      <div 
        class="ring-1 p-6 rounded-full ring-gray mb-2 hover:bg-gray"
        :class="{ 'ring-[rgb(247,145,29)]': isSelected(category) }"
      >
        <component :is="getIcon(category.icon)" class="w-6 h-6 lg:w-10 lg:h-10 " />
      </div>
      <span class="mt-1.5 text-xs text-secondary font-bold">{{ $t(`values.${category.name}`) }}</span>
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