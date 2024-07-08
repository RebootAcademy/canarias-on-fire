<template>
  <div class="h-full bg-gray-100">
    <div>
      <FeaturedEvents />
      <CategoriesFilter />
      <EventsHeader />
      <EventList :events="events" />
      <p v-if="error" class="text-red-500">{{ error }}</p>
      <p v-if="pending">Loading events...</p>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Canarias onFIRE - Eventos'
})

const { data, error, pending } = await useFetch('http://localhost:8080/api/events', {
  lazy: false,
  server: false,
})


if (error.value) {
  console.error('Error fetching events:', error.value)
}

const events = computed(() => data.value?.result || [])

</script>
