<template>
  <div class="flex flex-col items-start md:ml-3 w-full md:w-1/4">
    <!-- <RadioGroup 
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
    </RadioGroup> -->
    <button
      class="w-full rounded-md hover:bg-gray hover:text-primary p-2"
      :class="checkStyle('event')"
     @click="()=>handleClick('event')">
      {{ $t('event') }}
    </button>
    <button
      class="w-full rounded-md hover:bg-gray hover:text-primary p-2"
      :class="checkStyle('promotion')"
     @click="()=>handleClick('promotion')">
      {{ $t('promotion') }}
    </button>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()

onMounted(() => {
  eventStore.eventType = 'event'
})

const checkStyle = (type) => {
  if (type === eventStore.eventType) return 'bg-primary text-black'
}

const handleClick = (type) => eventStore.eventType = type
</script>