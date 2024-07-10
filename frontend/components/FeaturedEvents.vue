<template>
  <div class="relative w-full">
    <Carousel class="w-full">
      <CarouselContent>
        <CarouselItem v-for="event in events" :key="event.id">
          <div class="p-1">
            <Card>
              <CardContent class="flex flex-col items-center justify-center p-6 h-60">
                <span class="text-2xl font-semibold">{{ event.name }}</span>
                <p class="text-sm">{{ event.description }}</p>
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious class="absolute left-0 top-1/2 transform -translate-y-1/2" />
      <CarouselNext class="absolute right-0 top-1/2 transform -translate-y-1/2" />
    </Carousel>
  </div>
</template>

<script setup lang="ts">
const events = ref([
  { id: 1, name: 'Event 1', description: 'Description for Event 1' },
  { id: 2, name: 'Event 2', description: 'Description for Event 2' },
  { id: 3, name: 'Event 3', description: 'Description for Event 3' },
  { id: 4, name: 'Event 4', description: 'Description for Event 4' },
  { id: 5, name: 'Event 5', description: 'Description for Event 5' },
])
</script>
