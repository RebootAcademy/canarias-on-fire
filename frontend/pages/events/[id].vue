<template>
  <div class="relative bg-black">
    <NuxtImg :src="eventStore.event.coverImage || defaultImage" alt="Event Image" class="w-full h-96 object-cover" />
    <div class="flex p-8 gap-2">
      <span v-for="category in event.categories" :key="category._id" class="bg-gray-500 text-white text-xs font-semibold px-4 py-1 rounded-xl">
        {{ category.name }}
      </span>
    </div>
  </div>
  <div class="px-8 bg-black">
    <h1 class="text-2xl font-bold">{{ event.eventName }}</h1>
    <div class="flex flex-col gap-1 mt-2 text-gray-600">
      <div class="flex items-center gap-1">
        <i class="far fa-calendar-alt"></i>
        <span>{{ formattedDate }}</span>
      </div>
      <div class="flex items-center gap-1">
        <i class="far fa-clock"></i>
        <span>{{ event.startTime }} - {{ event.endTime }}</span>
      </div>
      <div class="flex items-center gap-1">
        <i class="fas fa-euro-sign"></i>
        <span>{{ formatPrice }} </span>
      </div>
    </div>
    <div class="mt-6">
      <h2 class="text-xl font-semibold">Sobre el evento</h2>
      <p class="mt-2">{{ event.eventDescription }}</p>
    </div>
    <div class="mt-6">
      <h2 class="text-xl font-semibold">Ubicación</h2>
      <img 
        v-if="event.eventLocation && event.eventLocation.mapImageUrl" 
        :src="event.eventLocation.mapImageUrl" 
        alt="Event Location" 
        class="w-full h-60 object-cover mt-2" 
      />
      <p v-else-if="pending">Cargando mapa...</p>
      <p v-else>No hay imagen del mapa disponible</p>
    </div>
    <div class="mt-6">
      <h2 class="text-xl font-semibold">Organizador</h2>
      <p class="text-white">{{ event.userId?.companyName }}</p>
    </div>
    <div v-show="!isBasicPayment">
      <EventGallery />
    </div>
    <div class="flex gap-2 mt-6 mb-6">
      <Button class="px-4">
        <Share2 class="mr-2 h-4 w-4" />
        Share
      </Button>
      <Button 
        v-if="userStore.userData.role === 'admin'"
        @click="editEvent"
      >
        <Pencil class="mr-2 h-4 w-4" />
        Edit
      </Button>
      <Button 
        v-if="userStore.userData.role === 'admin'" 
        @click="deleteEvent"
      >
        <Trash class="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
    <EventsRelated />
  </div>
</template>

<script setup>
import { Share2, Pencil, Trash } from 'lucide-vue-next'

import { formatEventDate } from '@/utils/dateUtils'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const eventStore = useEventStore()
const paymentStore = usePaymentStore()
const route = useRoute()
const router = useRouter()

const { event } = storeToRefs(eventStore)
const defaultImage = '/defaultEvent.jpg'
const eventId = route.params.id

const isBasicPayment = computed(() => {
  const payment = paymentStore.getPaymentById(eventStore.event.payment)
  return payment?.name === 'basic'
})

const { data, pending, error } = await eventStore.fetchEventById(eventId)

if (error) { 
  console.error('Error fetching event:', error) 
}

const editEvent = () => {
  router.push(`/events/edit/${eventId}`)
}

const deleteEvent = async () => {
  await eventStore.deleteEvent(event.value._id)
  router.push('/')
}

const formattedDate = computed(() => {
  return formatEventDate(event.value?.eventDate)
})

const formatPrice = computed(() => {
  return event.value.eventPrice === 0 ? 'Free' : `${event.value.eventPrice} €`
})

</script>