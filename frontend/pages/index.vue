<template>
  <div class="h-full bg-gray-100 w-full flex flex-col items-center">
    <div class="w-2/3">
      <Hero />
      <EventsCounter />
      <CategoriesFilter />
      <EventsHeader />
      <EventList />
      <FeaturedEvents />
      <ArticlesHeader />
      <ArticlesList :articles="articleStore.articles"/>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Canarias onFIRE - Eventos'
})

const eventStore = useEventStore()
const articleStore = useArticleStore()

onMounted(() => {
  eventStore.resetFilters()
})

</script>
