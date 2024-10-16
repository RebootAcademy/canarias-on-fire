<template>
  <div class="flex w-full h-full justify-center">
    <div class="w-full p-4 md:w-2/3 md:p-4">
      <header class="text-primary text-2xl lg:text-[38px] font-bold my-6 tracking-tighter ">{{ $t('createEvent') }}</header>
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