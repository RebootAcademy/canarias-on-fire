<template>
  <div
    v-show="!userStore.acceptedGeolocation"
    class="flex flex-col ml-6 italic"
  >
    <div class="flex flex-row gap-4 items-center">
      <LucideIcons.InfoIcon class="size-4 lg:w-4 lg:h-4" />
      <p class="">
        {{ t('geoLocationPermission') }}
      </p>
    </div>
    <p 
      class="text-sm not-italic"
    >
      {{ t('deniedGeoLocation') }}
    </p>
    <NuxtLink
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

</script>
<style scoped></style>
