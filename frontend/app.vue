<template>
  <div>
    <NuxtLayout />
  </div>
</template>

<script setup>
const eventStore = useEventStore()
const articleStore = useArticleStore()

onMounted(async () => {
  await eventStore.fetchCategories()
  await eventStore.fetchEvents()
  await articleStore.fetchArticles()
})
</script>