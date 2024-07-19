<template>
  <div class="flex justify-evenly mt-4">
    <div 
      v-for="category in eventStore.categories" 
      :key="category.id"
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
      <component :is="getIcon(category.icon)" class="w-8 h-8" />
    </div>
    </div>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'
import { storeToRefs } from 'pinia'
import * as LucideIcons from 'lucide-vue-next'

const eventStore = useEventStore()
const { selectedCategory } = storeToRefs(eventStore)

const getIcon = (iconName) => {
  return LucideIcons[iconName] || LucideIcons.HelpCircle // Icono por defecto si no se encuentra
}

const selectCategory = (category) => {
  eventStore.setSelectedCategory(category.name === selectedCategory.value ? null : category.name)
}

const isSelected = (category) => selectedCategory.value === category.name


</script>
