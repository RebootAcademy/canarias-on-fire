<template>
  <div class="h-full flex flex-col items-center p-4">
    <div 
      v-for="(event, idx) in events"
      :key="idx"
      class="w-full flex justify-center p-2"
      >
      <EventCard :event="event"/>
    </div>
  </div>
</template>

<script setup>

const { data: events } = await useFetch('api/events/')

</script>