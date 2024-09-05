<template>
  <div class="lg:px-6 w-full ">
<div class="w-full grid justify-items-center items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-4">      <EventCard 
        v-for="event in limitedEvents" 
        :key="event._id" 
        :event="event" 
        class="xs:w-[60%] sm:w-full"
      />
    </div>

    <p v-if="limitedEvents.length === 0" class="text-gray-500 mt-4">No se encontraron eventos.</p>
    <div v-if="limitedEvents.length > 9" class="mt-6 text-center">
      <NuxtLink to="/events">
        <Button variant="outline">
          Ver todos los eventos
        </Button>
      </NuxtLink>
    </div>  
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'

const eventStore = useEventStore()
const paymentStore = usePaymentStore()
const { filteredEvents } = storeToRefs(eventStore)

const limitedEvents = computed(() => {
  return filteredEvents.value
    .filter(event => event.status === 'published')
    .sort((a, b) => {
      const priorityA = getEventPriority(a)
      const priorityB = getEventPriority(b)

      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }
      
      return compareDates(a.eventDate, b.eventDate)
    })
    .slice(0, 9)
})

function getEventPriority(event) {
  const paymentId = event.type === 'event' ? event.payment._id : event.payment
  const payment = paymentStore.getPaymentById(paymentId?._id)
  return payment?.features?.readPriority
}

function compareDates(dateA, dateB) {
  if (dateA.year !== dateB.year) return dateA.year - dateB.year
  if (dateA.month !== dateB.month) return dateA.month - dateB.month
  return dateA.day - dateB.day
}

</script>

<style scoped>
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}
</style>