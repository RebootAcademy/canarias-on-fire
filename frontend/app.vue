<template>
  <div>
    <NuxtLayout />
  </div>
</template>

<script setup>
const eventStore = useEventStore()
const articleStore = useArticleStore()
const subscriptionStore = useSubscriptionStore()

onMounted(async () => {
  await eventStore.fetchCategories()
  await eventStore.fetchEvents()
  await articleStore.fetchArticles()
  await subscriptionStore.fetchSubscriptions()
})
</script>