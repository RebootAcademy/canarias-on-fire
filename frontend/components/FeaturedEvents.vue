<template>
  <section v-if="premiumEvents.length > 0" >
    <h1 class="text-2xl text-primary font-semibold mt-4">{{  $t('titles.featuresEvents') }}</h1>
    <p class="text-sm font-light opacity-70">{{  $t('eventAdvice') }}</p>
    <div class="relative w-full">
      <Carousel class="border-none shadow-none ">
        <CarouselContent >
          <CarouselItem
            v-for="event in premiumEvents" 
            :key="event.id"
          >
            <Card  class="border-0 flex items-center justify-center  bg-gray-900">
              <CardContent class="bg-black">
                <NuxtLink :to="`/events/${event._id}`" >
                  <NuxtImg v-if="event.coverImage" :src="event.coverImage" class="object-scale-down h-96 w-80" />
                  <NuxtImg v-else :src="event?.eventImages[0]?.url" class="object-scale-down h-96 w-80" />
                </NuxtLink>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious class="absolute left-0 top-1/2 transform -translate-y-1/2 text-primary " />
        <CarouselNext class="absolute right-0 top-1/2 transform -translate-y-1/2 text-primary " />
      </Carousel>
    </div>
  </section>
</template>

<script setup>
const eventStore = useEventStore()
const today = new Date()

const premiumEvents = ref([])
/* const somePremium = eventStore?.events.filter((event) => event?.payment?.name === 'optima plus' && new Date(event.eventDate.year, event.eventDate.month - 1, event.eventDate.day) >= today ) */
watchEffect(() => {
  if (eventStore.events) {
    premiumEvents.value = eventStore?.events.filter((event) => 
      event?.payment?.name === 'optima plus' && 
      new Date(event.eventDate.year, event.eventDate.month - 1, event.eventDate.day) >= today 
    )
  }
  return premiumEvents
})

</script>
