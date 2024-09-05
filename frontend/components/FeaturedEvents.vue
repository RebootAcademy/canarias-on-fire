<template>
  <h1 class="text-2xl text-primary font-semibold">{{  $t('titles.featuresEvents') }}</h1>
  <p class="text-sm font-light opacity-70">{{  $t('eventAdvice') }}</p>
  <div class="relative w-full">
    <Carousel class="border-none shadow-none ">
      <CarouselContent>
        <CarouselItem 
          v-show="event.payment.name === 'premium'" 
          v-for="event in eventStore.events" 
          :key="event.id"
        >
          <Card  class="border-0 flex items-center justify-center  bg-gray-900">
            <CardContent class="bg-black">
              <NuxtImg :src="event.coverImage" class="object-scale-down h-96 w-80" />
            </CardContent>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious class="absolute left-0 top-1/2 transform -translate-y-1/2 " />
      <CarouselNext class="absolute right-0 top-1/2 transform -translate-y-1/2" />
    </Carousel>
  </div>
</template>

<script setup>
const eventStore = useEventStore()
const paymentStore = usePaymentStore()
const somePremium = eventStore?.events.some((event) => event.payment.name === 'premium')
</script>
