<template>
  <div class="w-96 h-80 bg-white shadow-md rounded-md">
    <NuxtImg :src="event.eventImg || defaultImage" class="w-full h-40 object-cover" />
    <div class="p-4 flex flex-col justify-between">
      <h3 class="text-xl font-semibold">{{ event.eventName }}</h3>
      <p class="text-sm text-gray-600">{{ formattedDate() }}</p>
      <p class="text-sm text-gray-600">{{ event.startTime }} - {{ event.endTime }}</p>
      <p class="text-sm text-gray-600">{{ event.place }}</p>
      <p class="text-md font-semibold mt-2">{{ event.eventPrice === 0 ? 'FREE' : `${event.eventPrice} €` }}</p>
      <div class="flex flex-wrap gap-2 mt-2">
        <span v-for="category in event.categories" :key="category._id" class="bg-black text-white text-xs font-semibold px-4 py-1 rounded-xl">
          {{ category.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  event: Object
})

const defaultImage = './defaultEvent.jpg'

const formattedDate = () => {
  const { year, month, day } = props.event.eventDate
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

</script>