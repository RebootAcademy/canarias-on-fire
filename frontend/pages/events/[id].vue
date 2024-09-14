<template>
  <div class="relative bg-black">
    <NuxtImg
      :src="eventStore.event.coverImage || defaultImage"
      alt="Event Image"
      class="w-full h-96 object-cover"
    />
    <div class="flex p-8 gap-2">
      <span
        v-for="category in event.categories"
        :key="category._id"
        class="bg-gray-500 text-white text-xs font-semibold px-4 py-1 rounded-xl"
      >
        {{ category.name }}
      </span>
    </div>
  </div>
  <div class="px-8 bg-black text-white">
    <h1 class="text-3xl font-bold text-primary">{{ event.eventName }}</h1>
    <div class="flex justify-between">
      <div class="flex flex-col gap-1 mt-2">
        <h2 class="text-2xl font-semibold">Date and time</h2>
        <div class="flex items-center gap-1">
          <Clock size="16" />
          <span>{{ event.startTime }} - {{ event.endTime }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Calendar size="16" />
          <span>{{ formattedDate }}</span>
        </div>
      </div>
      <div>
        <TicketButton hasBorder="hasBorder" />
      </div>
    </div>
   <div class="mt-8">
      <h2 class="text-2xl font-semibold">{{$t('previewText.aboutEvent')}}</h2>
      <div class="prose max-w-none" v-html="eventStore.eventDescription"></div>
    </div>
    <div class="flex flex-col gap-2 my-8">
      <h2 class="text-2xl font-semibold">{{$t('eventLocation')}}</h2>
      <div class="flex gap-2">
        <MapPin size="20" />
        <p>{{ eventStore.eventLocation.address }}</p>
      </div>
      <details v-if="event.eventLocation && event.eventLocation.mapImageUrl" class="w-full lg:w-2/3">
        <summary class="text-primary">{{$t('previewText.showMap')}}</summary>
        <NuxtImg :src="eventStore.eventLocation.mapImageUrl" alt="Event Location" class="w-full h-60 lg:h-[500px] object-cover mt-4" />
      </details>
      <p v-else-if="pending">Cargando mapa...</p>
      <p v-else>No hay imagen del mapa disponible</p>
    </div>
    <div class="mt-6">
      <h2 class="text-xl font-semibold">Organizador</h2>
      <p>{{ event.userId?.companyName }}</p>
    </div>
    <div class="mt-6">
      <TicketButton />
    </div>
    <div v-show="!isBasicPayment">
      <EventGallery />
    </div>
    <div class="flex gap-2 mt-6 mb-6">
      <div class="bg-primary-gradient p-0.5 rounded-md">
        <Button
          class="px-4 bg-black hover:text-white hover:bg-primary-gradient"
        >
          <Share2 class="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
      <div class="bg-primary-gradient p-0.5 rounded-md" v-if="isAdmin">
        <Button
          @click="editEvent"
          class="px-4 bg-black hover:text-white hover:bg-primary-gradient"
        >
          <Pencil class="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>
      <div class="bg-primary-gradient p-0.5 rounded-md" v-if="isAdmin">
        <Button
          @click="deleteEvent"
          class="px-4 bg-black hover:text-white hover:bg-primary-gradient"
        >
          <Trash class="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
    <EventsRelated />
  </div>
</template>

<script setup>
import { Share2, Pencil, Trash, Clock, Calendar, MapPin } from 'lucide-vue-next'

import { formatEventDate } from '@/utils/dateUtils'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const eventStore = useEventStore()
const paymentStore = usePaymentStore()
const route = useRoute()
const router = useRouter()

const { event } = storeToRefs(eventStore)
const defaultImage = '/defaultImg.png'
const eventId = route.params.id
const isAdmin = userStore.userData?.role === 'admin'

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
