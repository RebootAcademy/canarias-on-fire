<template>
  <div class="flex flex-col gap-4">
    <div class="font-semibold">Event info</div>

    <div class="flex flex-col">
      <Label for="eventName" class="text-xs ml-1 mb-1">Event Name</Label>
      <Input
        v-model="eventStore.eventName"
        id="eventName"
        type="text"
        class="p-2 border rounded-md"
      />
    </div>
    <div class="flex flex-col">
      <Label for="eventName" class="text-xs ml-1 mb-2">Type</Label>
      <EventTypeRadioGroup />
    </div>

    <div
      v-if="eventStore.eventType === 'event'"
      class="flex w-full justify-between items-center"
    >
      <DatePicker />
      <TimePicker id="startTime" label="Start time" modelValue="startTime" />
      <TimePicker id="endTime" label="End Time" modelValue="endTime" />
    </div>

    <div v-else class="flex w-full justify-between items-center">
      <DateRangePicker />
    </div>

    <div class="flex flex-col">
      <LocationSearch />
    </div>

    <div v-show="eventStore.eventType === 'event'" class="flex items-start gap-8">
      <div class="w-1/3">
        <PriceInput />
      </div>
      <div class="flex flex-col mt-1 w-1/3">
        <CapacityInput />
      </div>
    </div>

    <div class="flex flex-col">
      <Label for="eventDescription" class="text-xs ml-1 mb-1"
        >Description</Label>
      <Textarea
        v-model="eventStore.eventDescription"
        id="eventDescription"
        class="p-2 border rounded-md"
      ></Textarea>
    </div>

    <div class="flex flex-col">
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

    <div class="flex flex-col">
      <ImageUploader />
    </div>

  </div>
  <Button @click="handleSubmit">Publish</Button>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()
const config = useRuntimeConfig()
// const isLoading = ref(false)
// const errorMessage = ref('')

const handleSubmit = async () => {
  eventStore.status = 'draft'
  const { data } = await useFetch(`${config.public.apiBaseUrl}/events`, {
    method: 'POST',
    body: eventStore,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (data.value) {
    router.push({ name: 'PaymentOptions', params: { eventId: data.value.id } })
  }
}

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
