<template>
  <div class="flex w-full h-full justify-center">
    <div class="bg-gray-100 w-3/4 p-4">
      <header class="text-2xl font-bold mt-6 mb-3 tracking-tighter ">Create a new event</header>
      <EventForm />
    </div>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'
const eventStore = useEventStore()

</script>

