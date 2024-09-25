<template>
  <div class="h-full bg-black w-full !flex !flex-col gap-2 items-center">
    <Hero />
    <div class="w-full flex flex-col items-center h-fit">
      <div class="flex flex-col gap-2 sm:w-3/4 md:w-3/4 lg:w-2/3">
        <EventsCounter />
        <CategoriesFilter :isEvents="true"/>
        <EventsHeader />
        <EventList />
      </div>
      <Explore />
      <div class="w-full flex flex-col gap-2 sm:w-3/4 md:w-3/4 lg:w-2/3">
        <h2>Promotions</h2>
        <CategoriesFilter />
        <PromotionsList />
      </div>
      <div class="flex flex-col gap-2 sm:w-3/4 md:w-3/4 lg:w-2/3">
        <FeaturedEvents />
        <ArticlesHeader />
        <ArticlesList :articles="articleStore.articles"/>
      </div>
      <SubscribeNewsletter />
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
