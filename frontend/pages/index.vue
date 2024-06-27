<template>
  <div class="h-full bg-gray-100">
    <div>
      <FeaturedEvents />
      <CategoriesFilter />
      <EventsHeader />
    </div>
    <EventList :events="events" class="flex-grow" />
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Evently.com - Eventos'
})

const { data, error } = await useFetch('http://localhost:8080/api/events')

if (error.value) {
  console.error('Error fetching events:', error.value)
}

const events = data.value?.result || []
console.log(events)
</script>
