<template>
  <div class="flex flex-col items-center p-6">
    <hr class="w-full border-t border-gray-300 mb-4" />
    <div class="flex items-center justify-center w-full px-4">
      <p class="text-xl font-bold text-center lg:text-3xl">{{  $t('counter') }} <span class="">{{ activeEventsCount }}</span></p>
    </div>
    <hr class="w-full border-t border-gray-300 mt-4" />
  </div>
</template>

<script setup>
const eventStore = useEventStore()

const activeEventsCount = computed(() => {
  return eventStore.events.filter(event => event.status === 'published' && 
  event.userId?.isActive && 
  event.userId?.isValidated).length 
})
</script>
