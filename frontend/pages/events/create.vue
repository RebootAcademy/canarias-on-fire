<template>
  <div class="flex w-full h-full justify-center">
    <div class="w-full p-4 md:w-2/3 md:p-4">
      <header class="text-2xl text-secondary font-bold mt-6 mb-3 tracking-tighter ">{{ $t('createEvent') }}</header>
      <EventForm />
    </div>
  </div>
</template>

<script setup>
const eventStore = useEventStore()
onMounted(() => {
  eventStore.resetCreateEventForm()
})
</script>