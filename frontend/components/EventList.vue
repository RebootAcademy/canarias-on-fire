<template>
  <div class="flex flex-col items-center px-10">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 w-full">
      <EventCard v-for="event in events" :key="event.id" :event="event" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  events: {
    type: Array
  }
})
</script>