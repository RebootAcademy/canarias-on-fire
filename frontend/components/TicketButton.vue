<template>
  <div
    v-if="hasBorder"
    class="flex flex-col items-center gap-2 bg-primary-gradient rounded-sm p-0.5 w-fit"
  >
  <div class="flex flex-col items-center gap-2 bg-background text-secondary rounded-sm px-6 py-3 w-fit">


    <h1 class="text-lg font-normal">Ticket price / <span>{{ eventStore.event.eventPrice }} €</span></h1>
    <div class="flex items-center gap-1">
    </div>
    <NuxtLink :to="eventStore.event.externalUrl" target="_blank">
      <Button class="bg-primary-gradient">Buy now</Button>
    </NuxtLink>
  </div>
</div>
<div 
    v-else 
    class="flex flex-col gap-2"
  >
    <h1 class="text-xl font-bold">Price</h1>
    <div class="flex items-center gap-1">
      <Tag size="14" class="transform -scale-x-100" />
      <p>{{ eventStore.event.eventPrice }} € per person</p>
    </div>
    
    <NuxtLink :to="eventStore.event.externalUrl" target="_blank">
      <Button class="bg-primary-gradient">Buy now</Button>
    </NuxtLink>
  </div>

</template>

<script setup>
import { Tag } from 'lucide-vue-next'
const eventStore = useEventStore()

const props = defineProps({
  hasBorder: Boolean
})

</script>
