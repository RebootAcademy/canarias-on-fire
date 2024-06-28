<template>
  <div class="flex flex-col gap-4">

    <!-- EVENT TYPE -->    <hr>
    <div class="flex flex-col">
      <p class="font-semibold">Event type</p>
      <p class="text-xs text-gray-500 mb-3">Select the date and time when the event will take place.</p>
      <EventTypeRadioGroup />
    </div>

    <!-- EVENT IMAGE -->
    <hr>
    <div class="flex flex-col gap-1">
      <p class="font-semibold">Select image</p>
      <p class="text-xs text-gray-500 mb-2">Select the image you want to display at the event.</p>
      <ImageUploader />
    </div>

    <!-- EVENT NAME, DATE & TIME -->
    <hr>
    <div class="flex flex-col gap-1">
      <p class="font-semibold">Name, date and time</p>
      <p class="text-xs text-gray-500 mb-2">Select the date and time when the event will take place.</p>
      <Label for="eventName" class="text-xs text-gray-500">
        Event Name
        <VeeField
          name="Event name"
          rules="required"
          v-slot="{ field, errors }"
        >
          <Input
            v-bind="field"
            v-model="eventStore.eventName"
            id="eventName"
            type="text"
            class="p-2 border rounded-md mb-1"
          />
          <span class="text-red-500 text-xs font-normal">{{ errors[0] }}</span>
        </VeeField>
      </Label>
    </div>
    <div
      v-if="eventStore.eventType === 'event'"
      class="flex w-full justify-between items-center"
    >
      <VeeField
        name="Date"
        rules="required"
        v-slot="{ field, errors }"
      >
        <div class="w-full flex flex-col">
          <DatePicker v-bind="field" />
          <span class="text-red-500 text-xs mt-1">{{ errors[0] }}</span>
        </div>
      </VeeField>

      <div class="w-full flex">
        <VeeField
          name="Start time"
          rules="required"
          v-slot="{ field, errors }"
        >
          <div class="w-full flex flex-col pl-8">
            <TimePicker v-bind="field" id="startTime" label="Start time" modelValue="startTime" />
            <span class="text-red-500 text-xs mt-1">{{ errors[0] }}</span>
          </div>
        </VeeField>
        <VeeField
          name="End time"
          rules="required"
          v-slot="{ field, errors }"
        >
          <div class="w-full flex flex-col pl-8">
            <TimePicker v-bind="field" id="endTime" label="Ending Time" modelValue="endTime" />
            <span class="text-red-500 text-xs mt-1">{{ errors[0] }}</span>
          </div>
        </VeeField>
      </div>

    </div>

    <div v-else class="flex w-full justify-between items-center">
      <DateRangePicker />
    </div>

    <!-- EVENT DESCRIPTION -->
    <hr>
    <div class="flex flex-col gap-1">
      <p class="font-semibold">Description</p>
      <p class="text-xs text-gray-500 mb-2">Use this space to tell the public about the details of your event. Be sure to include any relevant information that helps them understand the essence of the event and motivates them to participate.</p>
      <VeeField
        name="Description"
        rules="required"
        v-slot="{ field, errors }"
      >
        <Textarea
          v-bind="field"
          v-model="eventStore.eventDescription"
          id="eventDescription"
          class="p-2 border rounded-md h-40"
        ></Textarea>
        <span class="text-red-500 text-xs">{{ errors[0] }}</span>
      </VeeField>
    </div>

    <!-- EVENT LOCATION -->
    <hr>
    <div class="flex flex-col gap-1">
      <p class="font-semibold">Location</p>
      <p class="text-xs text-gray-500 mb-2">Specify the exact location where your event will be held. This information will help attendees plan their visit in advance.</p>
      <VeeField
        name="Location"
        rules="required"
        v-slot="{ field, errors }"
      >
        <LocationSearch v-bind="field" />
        <span class="text-red-500 text-xs">{{ errors[0] }}</span>
      </VeeField>
    </div>

    <!-- EVENT PRICE & CAPACITY -->
    <hr>
    <div v-show="eventStore.eventType === 'event'" class="flex flex-col gap-1">
      <p class="font-semibold">Price</p>
      <p class="text-xs text-gray-500 mb-2">Specify whether your event will be free or paid. If it is paid, please indicate the cost of admission.</p>
      <div class="flex items-start gap-4">
        <div class="w-1/6">
          <VeeField
            name="Price"
            rules="required"
            v-slot="{ field, errors }"
          >
            <PriceInput v-bind="field" />
            <span class="text-red-500 text-xs">{{ errors[0] }}</span>
          </VeeField>
        </div>
        <div class="w-1/6">
          <CapacityInput />
        </div>
      </div>
    </div>

    <!-- EXTERNAL URL -->
    <hr>
    <div class="flex flex-col mb-6">
      <Label for="externalUrl" class="text-xs ml-1 mb-1"
        >External site</Label
      >
      <Input
        v-model="eventStore.externalUrl"
        id="externalUrl"
        type="text"
        class="p-2 border rounded-md"
      />
    </div>
  </div>
  <hr class="mb-4">
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()

watch(() => eventStore.eventType, (newType) => {
  if (newType === 'event') {
    eventStore.eventDate = ''
  } else {
    const today = new Date()
    const nextMonth = new Date()
    nextMonth.setMonth(today.getMonth() + 1)
    eventStore.eventDate = { start: today, end: nextMonth }
  }
})
</script>
