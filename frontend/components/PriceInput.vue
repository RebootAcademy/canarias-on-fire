<template>
  <div>
    <Label for="eventPrice" class="text-xs ml-1">Price</Label>
    <div class="relative">
      <Input
        v-model="price"
        id="eventPrice"
        type="number"
        class="p-2 border rounded-md w-full pr-10"
        :disabled="isFree"
      />
      <span class="absolute right-2 top-2 text-gray-500">€</span>
    </div>
    <div class="flex items-center gap-2 mt-2">
      <Switch v-model="isFree" id="isFree" />
      <Label for="isFree">My tickets are free</Label>
    </div>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()
const isFree = ref(false)
const price = ref(eventStore.eventPrice)

watch(isFree, (newVal) => {
  if (newVal) {
    price.value = 0
    eventStore.eventPrice = 0
  }
})

watch(price, (newVal) => {
  eventStore.eventPrice = newVal
})
</script>