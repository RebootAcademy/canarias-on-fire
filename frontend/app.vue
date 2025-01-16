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
const userStore = useUserStore()
const subscriptionStore = useSubscriptionStore()
import Toaster from '@/components/ui/toast/Toaster.vue'

/* onMounted(async () => {
  await eventStore.fetchCategories()
  await eventStore.fetchEvents()
  await articleStore.fetchArticles()
  await paymentStore.fetchPayments()
  await subscriptionStore.fetchSubscriptions()
}) */

onMounted(async () => {
  await eventStore.fetchCategories()
  await articleStore.fetchArticles()
  await subscriptionStore.fetchSubscriptions()
  await paymentStore.fetchPayments()
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        await eventStore.fetchEvents(latitude, longitude)
        await userStore.setAcceptedGeolocation(true)
      },
      async (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          console.error('Acceso a la ubicación denegado por el usuario.');
          await eventStore.fetchEvents();
          await userStore.setAcceptedGeolocation(false)
        } else {
          console.error(
            'Error obteniendo la ubicación del usuario:',
            error.message
          );
        }

        // Llama a fetchEvents sin coordenadas si el acceso fue denegado
        await eventStore.fetchEvents();
      }
    )
  } else {
    console.error('Geolocalización no es soportada por este navegador.')
    await eventStore.fetchEvents()
  }
})
</script>
