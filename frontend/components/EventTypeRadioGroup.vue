<template>
  <div class="ml-3">
    <RadioGroup 
      v-model="eventStore.eventType" 
      default-value="event"
    >
      <div class="flex items-center space-x-2">
        <RadioGroupItem id="r1" value="event" />
        <Label for="r1">{{ $t('event') }}</Label>
      </div>
      <div class="flex items-center space-x-2">
        <RadioGroupItem id="r2" value="promotion" />
        <Label for="r2">{{ $t('promotion') }}</Label>
      </div>
    </RadioGroup>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()

if (!eventStore.eventType) {
  eventStore.eventType = 'event'
}
</script>