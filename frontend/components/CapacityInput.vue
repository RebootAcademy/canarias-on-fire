<template>
  <div>
    <Label for="eventCapacity" class="text-xs ml-1">Capacity</Label>
    <div class="relative">
      <Input
        v-model="eventStore.eventCapacity"
        id="eventCapacity"
        type="number"
        class="p-2 border rounded-md w-full pr-10"
        @input="validateCapacity"
      />
      <span class="absolute right-2 top-2 text-gray-500">px</span>
    </div>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()

const validateCapacity = () => {
  if (eventStore.eventCapacity < 0) {
    eventStore.eventCapacity = 0
  }
}
</script>