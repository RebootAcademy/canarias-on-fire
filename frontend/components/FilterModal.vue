<template>
  <div v-if="isFilterModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg p-6 w-11/12 max-w-2xl">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">ADD FILTER</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>
      <div>
        <h3 class="font-semibold">Ubication</h3>
        <p class="text-sm text-gray-500 mb-2">Select the island or islands you want to filter events by from the list below.</p>
        <div class="grid grid-cols-3 gap-2 mb-4">
          <label v-for="island in islands" :key="island" class="flex items-center">
            <input type="checkbox" v-model="selectedIslands" :value="island" class="mr-2">
            {{ island }}
          </label>
        </div>
        <h3 class="font-semibold">Date and time</h3>
        <p class="text-sm text-gray-500 mb-2">Select the date and time to refine your event search.</p>
        <div class="grid grid-cols-3 gap-2 mb-4 place-items-end">
          <DatePicker v-model="selectedDate" />
          <TimePicker v-model="startTime" />
        </div>
        <h3 class="font-semibold">Categories</h3>
        <p class="text-sm text-gray-500 mb-2">Select up to 3 categories to find events that match your interests.</p>
        <div class="grid grid-cols-3 gap-2 mb-4">
          <Button
            v-for="category in eventStore.categories"
            :key="category.id"
            @click="toggleCategory(category)"
            :variant="selectedCategories.includes(category.id) ? 'default' : 'outline'"
            class="text-xs"
          >
            {{ category.name }}
          </Button>
        </div>
        <Button @click="applyFilters">Apply filters</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'

const eventStore = useEventStore()
const { isFilterModalOpen, filters } = storeToRefs(eventStore)

const selectedIslands = ref(filters.value.islands)
// const selectedDate = ref(filters.value.date ? new Date(filters.value.date) : null)

// const startTime = ref(null)
const selectedCategories = ref(filters.value.categories)

const islands = ['Gran Canaria', 'La Palma', 'El Hierro', 'Lanzarote', 'Tenerife', 'La Gomera', 'Fuerteventura', 'La Graciosa']

const toggleCategory = (category) => {
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
    // date: selectedDate.value ? selectedDate.value.toISOString() : null,
    // startTime: startTime.value,
    categories: selectedCategories.value
  })
  closeModal()
}

// Opcional: resetear filtros cuando se abre el modal
watch(isFilterModalOpen, (newValue) => {
  if (newValue) {
    selectedIslands.value = filters.value.islands
    // selectedDate.value = filters.value.date ? new Date(filters.value.date) : null
    selectedCategories.value = [...filters.value.categories]
  }
})

</script>