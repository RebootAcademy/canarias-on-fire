<template>
  <section v-if="optimaEvents.length > 0" class="px-4">
    <div class="px-6">
      <h1 class="text-2xl text-primary font-semibold mt-4">
        {{ $t('titles.featuresEvents') }}
      </h1>
      <p class="text-sm">{{ $t('eventAdvice') }}</p>
    </div>
    <div class="overflow-x-auto w-full mt-4 p-2">
      <div
        :class="{
          'flex space-x-4 justify-start': optimaEvents.length > 1,
          'flex justify-center': optimaEvents.length === 1,
        }"
      >
        <div
          v-for="event in optimaEvents"
          :key="event.id"
          class="flex-shrink-0"
        >
          <NuxtLink :to="`/events/${event._id}`">
            <img
              v-if="event.coverImage"
              :src="event.coverImage"
              class="h-80 w-80 object-cover"
            />
            <img
              v-else
              :src="event?.eventImages[0]?.url"
              class="h-80 w-80 object-cover"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const eventStore = useEventStore()
const today = new Date()

const premiumEvents = ref([])

const optimaEvents = computed(() => {
  let premiumEvents = []
  if (eventStore.events) {
    premiumEvents = eventStore?.events.filter(
      (event) =>
        (!event.externalSource && 
        event?.payment?.name === 'optima plus' &&
         ( new Date(
            event.eventDate.year,
            event.eventDate.month - 1,
            event.eventDate.day
          ) >= today) ||
        new Date(
          event.eventEndDate?.year,
          event.eventEndDate?.month - 1,
          event.eventEndDate?.day
        ) >= today)
    )
  }
  return premiumEvents
})

</script>

<style scoped>
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #fbb03b #f7fafc;
}

/* Estilos adicionales para navegadores webkit (Chrome, Safari, etc.) */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f7fafc;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #fbb03b;
  border-radius: 3px;
}
</style>
