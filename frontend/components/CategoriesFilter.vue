<template>
  <div class="flex justify-center flex-wrap items-center gap-2.5">
    <div
      v-for="category in filterCategories"
      :key="category.id"
      class="flex flex-col items-center cursor-pointer p-2.5 rounded-lg transition-colors duration-300"
      :class="{ 'text-primary': isSelected(category) }"
      @click="toggleCategory(category)"
    >
      <div 
        class="ring-1 p-3 md:p-6 rounded-full ring-gray mb-2 hover:bg-gray"
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

const props = defineProps({
  isEvents: {
    type: Boolean,
    default: false
  }
})


const eventStore = useEventStore()
const { categories, selectedCategories, selectedCategoriesForPromotion } = storeToRefs(eventStore)

const filterCategories = computed (() => {
  if (props.isEvents) {
    return categories.value.filter((category) => category.name !== 'promotions' && category.name !== 'services')
  } else {
    return categories.value
  }
})

const getIcon = (iconName) => {
  return LucideIcons[iconName] || LucideIcons.HelpCircle
}

const isSelected = (category) => {
  if (props.isEvents) {
    return selectedCategories.value.some(c => c.id === category.id && c.name !== 'promotions' && c.name !== 'services')
  } else {
    return selectedCategoriesForPromotion.value.some(c => c.id === category.id )
  }
}

const toggleCategory = (category) => {
  if (props.isEvents) {
    eventStore.toggleCategory(category)
  } else {
    eventStore.toogleCategoryForPromotions(category)
  }
}
</script>