<template>
  <div class="flex flex-col gap-4">
    <div class="font-semibold">Event info</div>
    <div class="flex flex-col">
      <Label for="eventName" class="text-xs ml-1 mb-1">Event Name</Label>
      <Input v-model="eventStore.eventName" id="eventName" type="text" class="p-2 border rounded-md" />
    </div>
    <div class="flex w-full justify-between items-center">
      <DatePicker />
      <TimePicker id="startTime" label="Start time" modelValue="startTime" />
      <TimePicker  id="endTime" label="End Time" modelValue="endTime" />
    </div>

    <div class="flex flex-col">
      <Label for="eventLocalization" class="text-xs ml-1 mb-1">Localization</Label>
      <Input v-model="eventStore.eventLocalization" id="eventLocalization" type="text" class="p-2 border rounded-md" />
    </div>

    <div class="flex items-start gap-8">
      <div class="w-1/3">
        <PriceInput />
      </div>
      <div class="flex flex-col mt-1 w-1/3">
        <Label for="eventCapacity" class="text-xs ml-1 mb-1">Capacity</Label>
        <Input v-model="eventStore.eventCapacity" id="eventCapacity" type="number" class="p-2 border rounded-md" />
      </div>
    </div>
    <div class="flex flex-col">
      <Label for="eventDescription" class="text-xs ml-1 mb-1">Description</Label>
      <Textarea v-model="eventStore.eventDescription" id="eventDescription" class="p-2 border rounded-md"></Textarea>
    </div>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'
const eventStore = useEventStore()
</script>