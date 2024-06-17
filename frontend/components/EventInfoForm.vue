<template>
  <div class="flex flex-col gap-4">
    <div class="font-semibold">Event info</div>
    <div class="flex flex-col">
      <label for="eventName" class="text-xs ml-1">Event Name:</label>
      <Input v-model="eventStore.eventName" id="eventName" type="text" class="p-2 border rounded" />
    </div>
    <div class="flex w-full justify-between items-center">
      <DatePicker />
      <TimePicker id="startTime" label="Start time" modelValue="startTime" />
      <TimePicker  id="endTime" label="End Time" modelValue="endTime" />
    </div>

    <div class="flex flex-col">
      <label for="eventLocalization" class="text-xs ml-1">Localization:</label>
      <input v-model="eventStore.eventLocalization" id="eventLocalization" type="text" class="p-2 border rounded" />
    </div>
    <div class="flex flex-col">
      <label for="eventPrice" class="text-xs ml-1">Price:</label>
      <input v-model="eventStore.eventPrice" id="eventPrice" type="number" class="p-2 border rounded" />
    </div>
    <div class="flex flex-col">
      <label for="eventCapacity" class="text-xs ml-1">Capacity:</label>
      <input v-model="eventStore.eventCapacity" id="eventCapacity" type="number" class="p-2 border rounded" />
    </div>
    <div class="flex flex-col">
      <label for="eventDescription" class="text-xs ml-1">Description:</label>
      <textarea v-model="eventStore.eventDescription" id="eventDescription" class="p-2 border rounded"></textarea>
    </div>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'
const eventStore = useEventStore()
</script>