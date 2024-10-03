<template>
  <div class="flex w-full h-full justify-center">
    <div class="md:w-2/3 p-4">
      <header class="text-2xl font-bold mt-6 mb-3 tracking-tighter">{{ $t('editEvent') }}</header>
      <EventForm :isEditing="true" />
    </div>
  </div>
</template>

<script setup>
import { useEventStore } from '@/stores/eventStore'

const route = useRoute()
const eventStore = useEventStore()

const eventId = route.params.id

onMounted(async () => {
  await eventStore.fetchEventById(eventId)
})

useHead({
  title: 'Edit Event'
})
</script>