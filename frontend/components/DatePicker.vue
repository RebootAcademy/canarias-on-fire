<template>
  <div class="w-1/2">
    <Label for="eventDate" class="text-xs text-gray-500">Date</Label>
    <Popover>
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          :class="cn('w-full justify-start text-left', !eventStore.eventDate && 'text-muted-foreground', )"
        >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ eventStore.eventDate ? new Date(eventStore.eventDate).toLocaleDateString() : "Pick a date" }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <Calendar v-model="eventStore.eventDate" initial-focus />
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-vue-next'
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()
</script>