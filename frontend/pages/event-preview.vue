<template>
  <div class="relative">
    <NuxtImg :src="eventStore.eventImg" alt="Event Image" class="w-full h-96 object-cover" />
    <div class="flex p-8 gap-2">
      <span v-for="category in eventStore.selectedCategories" :key="category._id" class="bg-black text-white text-xs font-semibold px-4 py-1 rounded-xl">
        {{ category.name }}
      </span>
    </div>
  </div>
  <div class="px-8">
    <h1 class="text-4xl font-bold">{{ eventStore.eventName }}</h1>
    <div class="flex items-center gap-4 mt-4 text-gray-600">
      <div class="flex items-center gap-1">
        <i class="far fa-calendar-alt"></i>
        <span>{{ new Date(eventStore.eventDate).toLocaleDateString() }}</span>
      </div>
      <div class="flex items-center gap-1">
        <i class="far fa-clock"></i>
        <span>{{ eventStore.startTime }} - {{ eventStore.endTime }}</span>
      </div>
      <div class="flex items-center gap-1">
        <i class="fas fa-euro-sign"></i>
        <span>{{ eventStore.eventPrice }}€</span>
      </div>
    </div>
    <div class="mt-8">
      <h2 class="text-2xl font-semibold">About the event</h2>
      <p class="mt-4">{{ eventStore.eventDescription }}</p>
    </div>
    <div class="mt-8">
      <h2 class="text-2xl font-semibold">Location</h2>
      <NuxtImg :src="eventStore.eventLocation.mapImageUrl" alt="Event Location" class="w-full h-60 object-cover mt-4" />
    </div>
    <div class="mt-8">
      <h2 class="text-2xl font-semibold">Organizer</h2>
      <div class="flex items-center gap-2 mt-4">
        <NuxtImg :src="eventStore.organizerImg" alt="Organizer Image" class="w-10 h-10 rounded-full" />
        <span>{{ eventStore.organizerName }}</span>
      </div>
    </div>
    <Button @click="handleSubmit" class="mt-8">Register to Publish</Button>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'
import { useRouter } from 'vue-router'

const eventStore = useEventStore()
const router = useRouter()
const config = useRuntimeConfig()

const handleSubmit = async () => {
  const eventData = {
    categories: eventStore.selectedCategories,
    ...eventStore
  }

  const { data } = await useFetch(`${config.public.apiBaseUrl}/events`, {
    method: 'POST',
    body: eventData,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (data.value.success) {
    router.push({
      name: 'payment-options',
      query: { id: data.value.result._id }
    })
  }
}
</script>