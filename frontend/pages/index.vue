<template>
  <div class="h-full bg-gray-100">
    <div>
      <Hero />
      <EventsCounter :events="events"/>
      <CategoriesFilter />
      <EventsHeader />
      <EventList :events="events" />
      <FeaturedEvents />
      <ArticlesHeader />
      <ArticlesList />
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Canarias onFIRE - Eventos'
})

const { data, error } = await useFetch('http://localhost:8080/api/events', {
  lazy: false,
  server: false,
})


if (error.value) {
  console.error('Error fetching events:', error.value)
}

const events = computed(() => data.value?.result || [])

</script>
