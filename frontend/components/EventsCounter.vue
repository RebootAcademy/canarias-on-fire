<template>
  <div class="flex flex-col items-center p-6">
    <hr class="w-full border-t border-gray-300 mb-4" />
    <div class="flex items-center justify-center w-full px-4">
      <p class="text-2xl font-bold text-center lg:text-3xl">{{  $t('counter') }} <span class="">{{ activeEventsCount }}</span></p>
    </div>
    <hr class="w-full border-t border-gray-300 mt-4" />
  </div>
</template>

<script setup>
const eventStore = useEventStore()

function getStartOfWeek(date) {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(date.setDate(diff))
}

function getEndOfWeek(date) {
  const startOfWeek = getStartOfWeek(new Date(date));
  return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6))
}

const today = new Date();
const startOfWeek = getStartOfWeek(today)
const endOfWeek = getEndOfWeek(today)    

const activeEventsCount = computed(() => {
  return eventStore.events.filter(event => {
    
    const eventDate = new Date(event.eventDate.year, event.eventDate.month - 1, event.eventDate.day)
    return (
      event.status === 'published' &&
      event.eventType === 'event' &&
      ((event.userId?.isActive &&
      event.userId?.isValidated) || event.userId?.role === 'admin') &&
      eventDate >= startOfWeek && eventDate <= endOfWeek 
    );
  }).length;
});
</script>
