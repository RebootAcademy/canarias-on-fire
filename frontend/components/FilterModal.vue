<template>
  <div
    v-if="isFilterModalOpen"
    class="flex inset-0 justify-center items-center fixed w-screen h-screen z-40 bg-black bg-opacity-50"
  >
    <div class="bg-background border-2 rounded-lg p-4 md:p-6 w-11/12 max-w-2xl">
      <div class="flex justify-between items-center mb-4">
        <h2 class="w-full text-xl font-semibold text-center ">{{ $t('modalFilter.label')}}</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>
      <div>
        <h3 class="font-semibold">{{ $t('modalFilter.ubication')}}</h3>
        <p class="text-xs text-gray-500 mb-2">{{ $t('modalFilter.selectIsland')}}</p>
        <div class="grid grid-cols-2 md:grid-cols-3 md:gap-2 md:mb-4">
          <label v-for="island in islands" :key="island" class="flex items-center">
            <input type="checkbox" v-model="selectedIslands" :value="island" class="mr-2 accent-primary">
            {{ island }}
          </label>
        </div>
        <h3 class="font-semibold">{{ $t('modalFilter.date')}}</h3>
        <p class="text-xs text-gray-500 mb-2">{{ $t('modalFilter.dateDescription')}}</p>
        <div class="w-full">
          <DatePicker v-model="selectedDate" />
          <!-- <TimePicker v-model="startTime" /> -->
        </div>
        <h3 class="font-semibold mt-4">{{ $t('modalFilter.categories')}}</h3>
        <p class="text-xs text-gray-500 mb-2">{{ $t('modalFilter.categoriesDescription')}}</p>
        <div class="flex flex-wrap justify-center gap-2 mb-4">
          <div
            v-for="category in getCategories"
            :key="category.id"
            @click="toggleCategory(category)"
            :variant="selectedCategories.includes(category.id) ? 'default' : 'outline'"
            class="text-xs p-2 md:p-4 rounded-lg bg-gray border-0 hover:bg-primary hover:text-white "
            :class="selectedCategories.includes(category.id) ? 'bg-primary text-white' : ''"
          >
            {{ $t(`values.${category.name}`) }}
          </div>
        </div>
        <div v-if="isMusicSelected()" class="mt-4 w-full flex justify-center">
          <CustomSelect
            :items="genresItems"
            :placeholder="placeholderSelect"
            v-model:selected="selectedOption"
            :optionDefault="selectedOption"
            class="w-4/5 md:w-1/3"
          />
        </div>
        <div class="flex justify-end gap-4 mt-4">
          <Button @click="resetFilters" variant="ghost" class="bg-gray">{{ $t('buttons.reset')}}</Button>
          <CustomBtn 
            :title="$t('buttons.apply')"
            @click="applyFilters"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
const { t } = useI18n()

const props = defineProps({
  type: {
    type: String,
    default: 'event'
  }
})
import CustomBtn from './CustomBtn.vue'
const eventStore = useEventStore()
const { isFilterModalOpen, filters, eventDate } = storeToRefs(eventStore)

const selectedIslands = ref(filters.value.islands)
const selectedDate = ref(eventDate.value)
const selectedCategories = ref(filters.value.categories)
const selectedOption = ref('all')

watch(selectedOption, (value) => eventStore.musicFilter = value)
// const startTime = ref(null)

const getCategories = computed(() => {
  return eventStore.categories.filter((category) => category.type === props.type && category.name !== 'services')
})

const islands = ['Gran Canaria', 'La Palma', 'El Hierro', 'Lanzarote', 'Tenerife', 'La Gomera', 'Fuerteventura', 'La Graciosa']

const toggleCategory = (category) => {
  if (isMusicSelected()){
    selectedOption.value = 'all'
  }
  const index = selectedCategories.value.indexOf(category.id)
  if (index === -1) {
    selectedCategories.value.push(category.id)
  } else {
    selectedCategories.value.splice(index, 1)
  }
}

const closeModal = () => {
  eventStore.setFilterModalOpen(false)
}

const applyFilters = () => {
  eventStore.setFilters({
    islands: selectedIslands.value,
    date: selectedDate.value ? new Date(selectedDate.value) : null,
    categories: selectedCategories.value
    // startTime: startTime.value,
  })
  eventStore.selectedCategories = selectedCategories.value.map((category) => searchCategory(category))
  closeModal()
}

const searchCategory = (id) => {
  return eventStore.categories.find((category) => category.id === id)
}

const resetFilters = () => {
  selectedIslands.value = []
  selectedDate.value = null
  selectedCategories.value = []
  eventStore.resetFilters()
}

watch(eventDate, (newDate) => {
  selectedDate.value = newDate
})

watch(selectedDate, (newDate) => {
  eventStore.eventDate = newDate
})

watch(isFilterModalOpen, (newValue) => {
  if (newValue) {
    selectedIslands.value = filters.value.islands
    selectedCategories.value = [...filters.value.categories]
  }
})

const isMusicSelected = () => {
  return selectedCategories.value.some(
      (c) => c === '6702ad06009a63bba556a1f3'
    )
}

const genresItems = computed(() => {
  return [
    { value: 'all', label: t('onBoarding.step2Genres.all') },
    { value: 'djs', label: t('onBoarding.step2Genres.djs') },
    { value: 'latina', label: t('onBoarding.step2Genres.latina') },
    { value: 'electronic', label: t('onBoarding.step2Genres.electronic') },
    { value: 'rock', label: t('onBoarding.step2Genres.rock') },
    { value: 'jazz', label: t('onBoarding.step2Genres.jazz') },
    { value: 'classic', label: t('onBoarding.step2Genres.classic') },
    { value: 'other', label: t('onBoarding.step2Genres.other') },
  ]
})

</script>