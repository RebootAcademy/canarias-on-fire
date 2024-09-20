<template>
  <div>
    <Label for="eventCapacity" class="text-xs text-gray-500">{{ $t('capacity') }}</Label>
    <div class="relative">
      <!-- <Input
        v-model="eventStore.eventCapacity"
        id="eventCapacity"
        type="number"
        class="p-2 border rounded-md w-full pr-10"
        @input="validateCapacity"
      /> -->
      <Select v-model="eventStore.eventCapacity">
              <SelectTrigger>
                <SelectValue placeholder="0" />
              </SelectTrigger>
              <SelectContent class="text-gray-500">
                <SelectItem value="< 100 px">{{'< 100 px'}}</SelectItem>
                <SelectItem value="100 - 500 px">{{'100 - 500 px'}}</SelectItem>
                <SelectItem value="500 - 1000 px">{{'500 - 1000 px'}}</SelectItem>
                <SelectItem value="> 1000 px">{{'> 1000 px'}}</SelectItem>
              </SelectContent>
            </Select>
      <!-- <span class="absolute right-2 top-3 text-gray-500 text-sm">px</span> -->
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