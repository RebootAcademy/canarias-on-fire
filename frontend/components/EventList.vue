<template>
  <div class="flex flex-col items-center p-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      <div v-for="event in events" :key="event.id" class="bg-white shadow-sm rounded p-4">
        <div>
          <NuxtImg :src="event.eventImg"/>
          <h3 class="text-lg font-bold mt-3">{{ event.eventName }}</h3>
          <!-- <h4>{{ event.eventDate }}</h4> -->
          <p class="text-sm">{{ event.eventDescription }}</p>
          <p class="text-md font-semibold">{{ event.eventPrice }} €</p>
          <div class="flex flex-wrap gap-2 mt-2">
            <span v-for="category in event.categories" :key="category._id" class="bg-blue-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              {{ category.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  events: {
    type: Array
  }
})
</script>