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
        <div class="grid grid-cols-2 gap-2 mb-4">
          <label v-for="island in islands" :key="island" class="flex items-center">
            <input type="checkbox" v-model="selectedIslands" :value="island" class="mr-2">
            {{ island }}
          </label>
        </div>
        <h3 class="font-semibold">Date and time</h3>
        <p class="text-sm text-gray-500 mb-2">Select the date and time to refine your event search.</p>
        <div class="grid grid-cols-3 gap-2 mb-4">
          <DatePicker v-model="selectedDate" placeholder="Date" />
          <TimePicker v-model="startTime" placeholder="Start time" />
          <TimePicker v-model="endTime" placeholder="Ending time" />
        </div>
        <h3 class="font-semibold">Categories</h3>
        <p class="text-sm text-gray-500 mb-2">Select up to 3 categories to find events that match your interests.</p>
        <div class="grid grid-cols-3 gap-2 mb-4">
          <button
            v-for="category in categories"
            :key="category"
            @click="toggleCategory(category)"
            :class="{
              'bg-black text-white': selectedCategories.includes(category),
              'bg-white text-black': !selectedCategories.includes(category)
            }"
            class="border rounded-full px-4 py-2"
          >
            {{ category.name }}
          </button>
        </div>
        <button @click="applyFilters" class="bg-black text-white px-4 py-2 rounded-lg">APPLY</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'
import { storeToRefs } from 'pinia'

const eventStore = useEventStore()
const { isFilterModalOpen, categories } = storeToRefs(eventStore)

const selectedIslands = ref([])
const selectedDate = ref(null)
const startTime = ref(null)
const endTime = ref(null)
const selectedCategories = ref([])

const islands = ['Gran Canaria', 'La Palma', 'El Hierro', 'Lanzarote', 'Tenerife', 'La Gomera', 'Fuerteventura', 'La Graciosa']

const closeModal = () => {
  eventStore.setFilterModalOpen(false)
}

const toggleCategory = (category) => {
  if (selectedCategories.value.includes(category)) {
    selectedCategories.value = selectedCategories.value.filter(c => c !== category)
  } else if (selectedCategories.value.length < 3) {
    selectedCategories.value.push(category)
  }
}

const applyFilters = () => {
  eventStore.setFilters({
    islands: selectedIslands.value,
    date: selectedDate.value,
    startTime: startTime.value,
    endTime: endTime.value,
    categories: selectedCategories.value
  })
  closeModal()
}

</script>