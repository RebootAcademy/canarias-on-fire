<template>
  <div>
    <NuxtLayout />
  </div>
</template>

<script setup>
import { useEventStore } from '~/stores/eventStore'

const eventStore = useEventStore()
const articleStore = useArticleStore()

onMounted(async () => {
  await eventStore.fetchEvents()
  await eventStore.fetchCategories()
  await articleStore.fetchArticles()
})
</script>