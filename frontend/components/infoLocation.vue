<template>
  <div
    v-show="!userStore.acceptedGeolocation"
    class="flex flex-row items-center ml-6 gap-4 italic"
  >
    <LucideIcons.InfoIcon class="size-4 lg:w-4 lg:h-4" />
    <p class="">
      {{ t('geoLocationPermission') }}
    </p>
  </div>
</template>

<script setup>
import * as LucideIcons from 'lucide-vue-next'
const userStore = useUserStore()
const { t } = useI18n()
</script>
<style scoped></style>
