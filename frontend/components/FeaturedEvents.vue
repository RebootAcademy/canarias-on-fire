<template>
  <h1 class="text-2xl text-primary font-semibold mt-4">{{  $t('titles.featuresEvents') }}</h1>
  <p class="text-sm font-light opacity-70">{{  $t('eventAdvice') }}</p>
  <div class="relative w-full">
    <Carousel class="border-none shadow-none ">
      <CarouselContent v-if="somePremium.length" >
        <CarouselItem
          v-for="event in somePremium" 
          :key="event.id"
        >
          <Card  class="border-0 flex items-center justify-center  bg-gray-900">
            <CardContent class="bg-black">
              <NuxtLink :to="`/events/${event._id}`" >
                <NuxtImg v-if="event.coverImage" :src="event.coverImage" class="object-scale-down h-96 w-80" />
                <NuxtImg v-else :src="event.eventImages[0].url" class="object-scale-down h-96 w-80" />
              </NuxtLink>
            </CardContent>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious class="absolute left-0 top-1/2 transform -translate-y-1/2 text-primary " />
      <CarouselNext class="absolute right-0 top-1/2 transform -translate-y-1/2 text-primary " />
    </Carousel>
  </div>
</template>

<script setup>
const eventStore = useEventStore()
const today = new Date()

let somePremium
/* const somePremium = eventStore?.events.filter((event) => event?.payment?.name === 'premium' && new Date(event.eventDate.year, event.eventDate.month - 1, event.eventDate.day) >= today )
console.log(somePremium) */

watchEffect(() => {
  if (eventStore.events) {
    somePremium = eventStore?.events.filter((event) => 
      event?.payment?.name === 'premium' && 
      new Date(event.eventDate.year, event.eventDate.month - 1, event.eventDate.day) >= today 
    );
  }
  return somePremium
});
</script>
