<template>
  <div class="flex flex-col gap-2">
    <p class="font-semibold">{{ $t('tags') }}</p>
    <p class="text-xs text-gray-500 mb-2">{{ $t('chooseTags') }}</p>
    <div class="flex flex-wrap gap-2 p-2 mb-4">
      <Badge 
        v-for="category in eventStore.categories"
        :key="category.id"
        :class="{'bg-transparent border-primary ' : isSelected(category), 'bg-gray' : !isSelected(category)}"
        @click="toggleCategory(category)"
        variant="secondary"
        class="p-2 px-4 cursor-pointer text-white hover:bg-black"
      >{{ $t(`values.${category.name}`) }}</Badge>
    </div>
    <span v-if="eventStore.hasTriedSubmit" class="text-red-500 text-xs">{{ errors.categories }}</span>
  </div>
  <hr class="mb-4">
</template>

<script setup>
const {t} = useI18n()
import { errors, validateFields } from '../utils/validation'

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  }
})

const eventStore = useEventStore()

onMounted(async () => {
  if (props.isEditing && eventStore.event && eventStore.event.categories) {
    eventStore.selectedCategories = eventStore.event.categories
  }
})

const isSelected = (category) => {
  return eventStore.selectedCategories.some(c => c && c.id === category.id)
}

const toggleCategory = (category) => {
  console.log('Category received:', category)

  if (!category || !category.id) {
    console.error('Invalid category:', category)
    return
  }

  if (!Array.isArray(eventStore.selectedCategories)) {
    console.error('selectedCategories is not an array:', eventStore.selectedCategories)
    eventStore.setSelectedCategories([])
  }

  console.log('Current selectedCategories:', eventStore.selectedCategories)

  const index = eventStore.selectedCategories.findIndex(c => c && c.id === category.id)

  console.log('Found index:', index)

  let updatedCategories
  if (index === -1) {
    updatedCategories = [...eventStore.selectedCategories, category]
  } else {
    updatedCategories = eventStore.selectedCategories.filter(c => c && c.id !== category.id)
  }

  console.log('Updated categories:', updatedCategories)

  eventStore.setSelectedCategories(updatedCategories)
  validateFields()
}

watch(() => eventStore.selectedCategories, (newValue) => {
  console.log('selectedCategories changed:', newValue)
}, { deep: true })

</script>
