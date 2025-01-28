<template>
  <div
    v-show="!userStore.acceptedGeolocation"
    class="flex flex-col ml-6 italic"
  >
    <Spinner v-if="isLoading" />
    <button 
      v-if="status && status !== 'denied'"
      class="my-2 max-w-[200px] border-primary border-2 rounded-md p-2 w-1/2" @click="requestGeolocation"
    >
      {{ t('activeGeoLocation') }}
    </button>
    <div class="flex flex-row gap-4 items-center">
      <LucideIcons.InfoIcon class="size-4 lg:w-4 lg:h-4" />
      <p class="">
        {{ t('geoLocationPermission') }}
      </p>
    </div>
    <p 
      v-if="!status || status === 'denied'" 
      class="text-sm not-italic"
    >
      {{ t('deniedGeoLocation') }}
    </p>
    <NuxtLink
      v-if="!status || status === 'denied'" 
      class="underline text-blue-500" 
      href="/help/technical" 
      target="_blank"
    >
    {{ t('showGeolocation') }}
    </NuxtLink> 
  </div>
</template>

<script setup>
import * as LucideIcons from 'lucide-vue-next'
const userStore = useUserStore()
const eventStore = useEventStore()
const { t } = useI18n()

const status = ref('')
const isLoading = ref(false)

async function requestGeolocation() {
  try {
    if (!isLoading.value) isLoading.value = true
    const permissionStatus = await navigator.permissions.query({
      name: 'geolocation',
    })
    status.value = permissionStatus.state
    const handlePermissionChange = async () => {
      if (permissionStatus.state === 'prompt') {
        if (!isLoading.value) isLoading.value = true
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await eventStore.fetchEvents(latitude, longitude);
            await userStore.setAcceptedGeolocation(true)
          },
          (error) => {
            console.error('Error obteniendo la ubicación:', error.message)
          }
        )
      } else {
        if (!isLoading.value) isLoading.value = true
        await eventStore.fetchEvents(); 
        await userStore.setAcceptedGeolocation(false);
        window.location.reload()
      }
    }
    permissionStatus.addEventListener('change', handlePermissionChange);
    await handlePermissionChange()
    isLoading.value = false
  } catch (error) {
    console.error('Error solicitando permisos de geolocalización:', error);
  }
}
</script>
<style scoped></style>
