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
  const isLoading = ref(true)
  
  await nextTick()
  if (localStorage.getItem('themePreference') === 'light') {
    document.body.classList.remove('dark');
  } else {
    document.body.classList.add('dark');
    userStore.setThemePreference('dark')
  }  

  async function monitorGeolocation() {
    if (!navigator.permissions) {
      console.warn('La API de permisos no está disponible en este navegador.')
      if (!isLoading.value) isLoading.value = true
      await eventStore.fetchEvents()
      isLoading.value = false
      return
    }

    try {
      if (!isLoading.value) isLoading.value = true
      const permissionStatus = await navigator.permissions.query({
        name: 'geolocation',
      })

      const handlePermissionChange = async () => {

        if (permissionStatus.state === 'granted') {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords
              await eventStore.fetchEvents(latitude, longitude)
              await userStore.setAcceptedGeolocation(true)
            },
            (error) => {
              console.error('Error obteniendo la ubicación:', error.message)
            }
          )
          isLoading.value = false
        } else if (
          permissionStatus.state === 'prompt' ||
          permissionStatus.state === 'denied'
        ) {
          
          await eventStore.fetchEvents()
          await userStore.setAcceptedGeolocation(false)
          isLoading.value = false
        }
      }

      permissionStatus.addEventListener('change', handlePermissionChange)

      await handlePermissionChange()
    } catch (error) {
      console.error('Error al manejar permisos de geolocalización:', error)
      if (!isLoading.value) isLoading.value = true
      await eventStore.fetchEvents()
      isLoading.value = false
    }
  }

  monitorGeolocation()
})
</script>
