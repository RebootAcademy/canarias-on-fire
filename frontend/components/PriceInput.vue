<template>
  <div>
    <Label for="eventPrice" class="text-xs text-gray-500">Price</Label>
    <div class="relative">
      <Input
        v-model="eventStore.eventPrice"
        id="eventPrice"
        type="number"
        class="p-2 border rounded-md w-full pr-10"
        :disabled="eventStore.isFree"
        @input="validatePrice"
      />
      <span class="absolute right-2 top-2 text-gray-500">€</span>
    </div>
    <div class="flex items-center gap-2 mt-2 text-gray-500">
      <Switch v-model:checked="eventStore.isFree" id="isFree" />
      <Label for="isFree" class="text-xs">My tickets are free</Label>
    </div>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()

const validatePrice = () => {
  if (eventStore.eventPrice < 0) {
    eventStore.eventPrice = 0
  }
}
</script>