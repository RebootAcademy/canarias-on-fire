<template>
  <div class="flex flex-col gap-2">
    <p class="font-semibold">{{ $t('tags') }}</p>
    <p class="text-xs text-gray-500 mb-2">{{ $t('chooseTags') }}</p>
    <div class="flex flex-wrap gap-2 p-2 mb-4">
      <Badge 
        v-for="category in categories"
        :key="category._id"
        :class="{'bg-black text-white' : isSelected(category), 'bg-white' : !isSelected(category)}"
        @click="toggleCategory(category)"
        variant="secondary"
        class="p-2 px-4 cursor-pointer"
      >{{ $t(`values.${category.name}`) }}</Badge>
    </div>
    <span v-if="error" class="text-red-500 text-xs">{{ error }}</span>
  </div>
  <hr class="mb-4">
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'

const { t, tm } = useI18n()
const eventStore = useEventStore()
const config = useRuntimeConfig()
const error = ref('')

const { data, error: fetchError } = await useAsyncData('categories', () => $fetch(`${config.public.apiBaseUrl}/categories`, {
  method: 'GET'
})) 

if (fetchError.value) {
  console.error('Error geting categories from database:', fetchError.value)
} else {
  // console.log('Categories fetched from databse', data.value)
}

const categories = data.value?.result || []

const toggleCategory = (category) => {
  eventStore.toggleCategory(category)
  validateCategories()
}

const isSelected = (category) => {
  return eventStore.selectedCategories.some(c => c._id === category._id)
}

const validateCategories = () => {
  const selectedCount = eventStore.selectedCategories.length
  if (selectedCount < 1) {
    error.value = t('mustSelectTag')
  } else if (selectedCount > 5) {
    error.value = t('cantSelectMoreTags')
  } else {
    error.value = ''
  }
}

validateCategories()

watch(() => eventStore.selectedCategories, validateCategories)
</script>
