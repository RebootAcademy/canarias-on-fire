<template>
  <div class="relative">
    <NuxtImg :src="eventStore.event.coverImage || defaultImage" alt="Event Image" class="w-full h-96 object-cover" />
    <div class="flex p-8 gap-2">
<!--       <span v-for="category in eventStore.selectedCategories" :key="category.id" class="bg-black text-white text-xs font-semibold px-4 py-1 rounded-xl">
        {{ category.name }}
      </span> -->
    </div>
  </div>
  <div class="px-8">
    <h1 class="text-4xl font-bold">{{ eventStore.eventName }}</h1>
    <div class="flex items-center gap-4 mt-4 text-gray-600">
      <div class="flex items-center gap-1">
        <i class="far fa-calendar-alt"></i>
        <span>{{ new Date(eventStore.eventDate).toLocaleDateString() }}</span>
      </div>
      <div class="flex items-center gap-1">
        <i class="far fa-clock"></i>
        <span>{{ eventStore.startTime }} - {{ eventStore.endTime }}</span>
      </div>
      <div class="flex items-center gap-1">
        <i class="fas fa-euro-sign"></i>
        <span>{{ eventStore.eventPrice }}€</span>
      </div>
    </div>
    <div class="mt-8">
      <h2 class="text-2xl font-semibold">Sobre el evento</h2>
      <p class="mt-4">{{ eventStore.eventDescription }}</p>
    </div>
    <div class="mt-8">
      <h2 class="text-2xl font-semibold">Ubicación</h2>
      <NuxtImg :src="eventStore.eventLocation.mapImageUrl" alt="Event Location" class="w-full h-60 object-cover mt-4" />
    </div>
    <div class="mt-8">
      <h2 class="text-2xl font-semibold">Organizador</h2>
<!--       <div class="flex items-center gap-2 mt-4">
        <NuxtImg :src="eventStore.organizerImg" alt="Organizer Image" class="w-10 h-10 rounded-full" />
        <span>{{ eventStore.organizerName }}</span>
      </div> -->
    </div>
    <div>
      <TicketButton />
    </div>
    <div>
      <EventGallery />
      <p class="text-xs text-primary">* Feature only available for Gold and Premium events.</p>
    </div>
    <Button @click="publishEvent" class="mt-8">Publish</Button>
  </div>
</template>

<script setup>
const userStore = useUserStore()
const eventStore = useEventStore()
const route = useRoute()
const router = useRouter()

const eventId = route.params.id
const defaultImage = './defaultEvent.jpg'

onMounted(async () => {
  await eventStore.fetchEventById(eventId)
  eventStore.normalizeCategories()
})

const publishEvent = async () => {
  if (eventStore.event.eventType === 'event') {
    // Para eventos, redirigir a la página de pago
    router.push(`/payment?id=${eventId}&type=${eventStore.eventType}`)
    console.log('status: ', eventStore.event.status)
  } else if (eventStore.event.eventType === 'promotion') {
    if (userStore.userData.activeSubscription?.status === 'active' || userStore.userData.role === 'admin') {
      const result = await eventStore.updateEventStatus(eventId, 'published')
      if (result) {
        router.push(`/events/${eventId}`)
      } else {
        console.error('Failed to publish promotion')
      }
    } else {
      router.push(`/pricing?id=${eventId}&type=${eventStore.event.eventType}`)
    }
  }
}

</script>