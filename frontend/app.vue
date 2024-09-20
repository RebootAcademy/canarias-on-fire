<template>
  <div>
    <NuxtLayout />
    <Toaster />
  </div>
</template>

<script setup>
const eventStore = useEventStore()
const articleStore = useArticleStore()
const paymentStore = usePaymentStore()
const subscriptionStore = useSubscriptionStore()
import Toaster from '@/components/ui/toast/Toaster.vue'

onMounted(async () => {
  await eventStore.fetchCategories()
  await eventStore.fetchEvents()
  await articleStore.fetchArticles()
  await paymentStore.fetchPayments()
  await subscriptionStore.fetchSubscriptions()
})
</script>