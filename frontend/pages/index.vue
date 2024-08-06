<template>
  <div class="h-full bg-black w-full flex flex-col items-center">
    <Hero />
    <div class="w-2/3">
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
  title: 'Evente - Home'
})

const eventStore = useEventStore()
const articleStore = useArticleStore()

onMounted(() => {
  eventStore.resetFilters()
})

</script>
