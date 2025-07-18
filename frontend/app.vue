<template>
  <div>
    <Spinner v-if="isLoading" />
    <NuxtLayout v-else />
    <Toaster />
  </div>
</template>

<script setup>
const route = useRoute()
const eventStore = useEventStore()
const articleStore = useArticleStore()
const paymentStore = usePaymentStore()
const userStore = useUserStore()
const subscriptionStore = useSubscriptionStore()
import Toaster from '@/components/ui/toast/Toaster.vue'
const isLoading = ref(true)
const permissionState = ref(undefined)

let permissionCheckInterval = null

async function checkPermissions() {
  const permissionStatus = await navigator.permissions.query({ name: 'geolocation' })
  
  if (permissionState.value !== permissionStatus.state) {
    console.log(`Permission changed to ${permissionStatus.state}`)
    permissionState.value = permissionStatus.state
  }

  return permissionStatus
}

onMounted(async () => {
  isLoading.value = true
  if (!navigator.permissions) {
    console.warn('La API de permisos no está disponible en este navegador.')
    await eventStore.fetchEvents()
    isLoading.value = false
    return
  }

    const permissionStatus = await checkPermissions()
    permissionCheckInterval = setInterval(checkPermissions, 2000)

    permissionStatus.addEventListener('change', () => {
      permissionState.value = permissionStatus.state
    })
  await Promise.all([
    eventStore.fetchCategories(),
    articleStore.fetchArticles(),
    subscriptionStore.fetchSubscriptions(),
    paymentStore.fetchPayments()
  ])

  await nextTick()

  if (localStorage.getItem('themePreference') === 'light') {
    document.body.classList.remove('dark')
  } else {
    document.body.classList.add('dark')
    userStore.setThemePreference('dark')
  }
})

onUnmounted(() => {
  if (permissionCheckInterval) {
    clearInterval(permissionCheckInterval)
  }
})

watch(permissionState, async (newState, oldState) => {
  console.log(`Permission changed from ${oldState} to ${newState}`)
  isLoading.value = true

  switch (newState) {
    case 'prompt':
    case 'granted':
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          await eventStore.fetchEvents(latitude, longitude)
          await userStore.setAcceptedGeolocation(true)
          userStore.setLocation(latitude, longitude)
          isLoading.value = false
        },
        async (error) => {
          console.error('Error obtaining location:', error.message)
          await eventStore.fetchEvents()
          isLoading.value = false
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      )
      break
    case 'denied':
    default:
      await eventStore.fetchEvents()
      await userStore.setAcceptedGeolocation(false)
      isLoading.value = false
      break
  }
})
</script>
