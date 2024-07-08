<template>
  <div class="flex flex-col gap-4">
    <!-- EVENT TYPE -->
    <hr />
    <div class="flex flex-col">
      <p class="font-semibold">{{ $t('eventType') }}</p>
      <p class="text-xs text-gray-500 mb-3">{{ $t('selectDateTime') }}</p>
      <EventTypeRadioGroup />
    </div>

    <!-- EVENT IMAGE -->
    <hr />
    <div class="flex flex-col gap-1">
      <p class="font-semibold">{{ $t('selectImage') }}</p>
      <p class="text-xs text-gray-500 mb-2">
        {{ $t('selectImageDescription') }}
      </p>
      <ImageUploader />
    </div>

    <!-- EVENT NAME, DATE & TIME -->
    <hr />
    <div class="flex flex-col gap-1">
      <p class="font-semibold">{{ $t('eventInfo') }}</p>
      <p class="text-xs text-gray-500 mb-2">{{ $t('eventInfoDescription') }}</p>
      <Label for="eventName" class="text-xs text-gray-500">
        {{ $t('eventNameLabel') }}
        <Input
          v-model="eventStore.eventName"
          id="eventName"
          type="text"
          class="p-2 border rounded-md mb-1"
        />
        <span v-if="eventStore.hasTriedSubmit" class="text-red-500 text-xs font-normal">{{ errors.eventName }}</span>
      </Label>
    </div>
    <div
      v-if="eventStore.eventType === 'event'"
      class="flex w-full justify-between items-center"
    >
      <div class="w-full flex">
        <div class="w-full flex flex-col">
          <DatePicker />
          <span v-if="eventStore.hasTriedSubmit" class="text-red-500 text-xs mt-1">{{ errors.eventDate }}</span>
        </div>
        <div class="w-full flex flex-col pl-8">
          <TimePicker
            id="startTime"
            label="Start time"
            modelValue="startTime"
          />
          <span v-if="eventStore.hasTriedSubmit" class="text-red-500 text-xs mt-1">{{ errors.startTime }}</span>
        </div>
        <div class="w-full flex flex-col pl-8">
          <TimePicker
            id="endTime"
            label="Ending Time"
            modelValue="endTime"
          />
        </div>
      </div>
    </div>

    <div v-else class="flex w-full justify-between items-center">
      <DateRangePicker />
    </div>

    <!-- EVENT DESCRIPTION -->
    <hr />
    <div class="flex flex-col gap-1">
      <p class="font-semibold">{{ $t('eventDescription') }}</p>
      <p class="text-xs text-gray-500 mb-2">
        {{ $t('eventDescriptionDescription') }}
      </p>
      <Textarea
        v-model="eventStore.eventDescription"
        id="eventDescription"
        class="p-2 border rounded-md h-40"
      ></Textarea>
      <span v-if="eventStore.hasTriedSubmit" class="text-red-500 text-xs">{{ errors.description }}</span>
    </div>

    <!-- EVENT LOCATION -->
    <hr />
    <div class="flex flex-col gap-1">
      <p class="font-semibold">{{ $t('eventLocation') }}</p>
      <p class="text-xs text-gray-500 mb-2">
        {{ $t('eventLocationDescription') }}
      </p>
      <LocationSearch v-model="eventStore.eventLocation" />
      <span v-if="eventStore.hasTriedSubmit" class="text-red-500 text-xs">{{ errors.location }}</span>
    </div>

    <!-- EVENT PRICE & CAPACITY -->
    <hr />
    <div v-show="eventStore.eventType === 'event'" class="flex flex-col gap-1">
      <p class="font-semibold">{{ $t('eventPrice') }}</p>
      <p class="text-xs text-gray-500 mb-2">
        {{ $t('eventPriceDescription') }}
      </p>
      <div class="flex items-start gap-4">
        <div class="w-1/6">
          <PriceInput v-model="eventStore.eventPrice"  />
          <span v-if="eventStore.hasTriedSubmit" class="text-red-500 text-xs">{{ errors.price }}</span>
        </div>
        <div class="w-1/6">
          <CapacityInput />
        </div>
      </div>
    </div>

    <!-- EXTERNAL URL -->
    <hr />
    <div class="flex flex-col mb-6">
      <Label for="externalUrl" class="text-xs ml-1 mb-1">{{ $t('externalUrl') }}</Label>
      <Input
        v-model="eventStore.externalUrl"
        id="externalUrl"
        type="text"
        class="p-2 border rounded-md"
      />
    </div>
  </div>
  <hr class="mb-4" />
</template>

<script setup>
import { errors, validateFields } from '../utils/validation'
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()
const { t, locale } = useI18n()

watch(
  () => [
    eventStore.eventName,
    eventStore.eventDate,
    eventStore.startTime,
    eventStore.eventDescription,
    eventStore.eventLocation.address,
    eventStore.eventPrice,
    eventStore.isFree
  ],
  () => validateFields(t),
  { immediate: true }
)

watch(
  () => eventStore.eventType,
  (newType) => {
    if (newType === 'event') {
      eventStore.eventDate = ''
    } else {
      const today = new Date()
      const nextMonth = new Date()
      nextMonth.setMonth(today.getMonth() + 1)
      eventStore.eventDate = { start: today, end: nextMonth }
    }
  }
)

watch(
  () => locale.value,
  () => validateFields(t)
)
</script>
