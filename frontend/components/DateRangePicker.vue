<template>
  <div class="flex flex-col text-gray-500 w-full">
    <Label for="eventDate" class="text-xs mb-2">{{ $t('eventPeriod') }}</Label>
    <Popover>
      <PopoverTrigger as-child>
        <Button
          variant="ghost"
          :class="cn(' bg-gray justify-start text-left w-full', !eventStore.eventDate && 'text-muted-foreground', )"
        >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ eventStore.eventDate?.start && eventStore.eventDate?.end ? 
          `${new Date(eventStore.eventDate.start).toLocaleDateString()} - ${new Date(eventStore.eventDate.end).toLocaleDateString()}` 
          : $t('pickPeriod')
        }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <RangeCalendarRoot 
        :modelValue="eventStore.eventDate" 
        :defaultValue="defaultDateRange" 
        initial-focus 
        @input="onInputDateChange"
        @change="onDateChange"
        @update:modelValue="updateDateRange"
      >
          <RangeCalendar />
        </RangeCalendarRoot>
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-vue-next'
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()

const today = new Date()
const nextMonth = new Date()
nextMonth.setMonth(today.getMonth() + 1)
const defaultDateRange = { start: today, end: nextMonth }

const onDateChange = (event) => {
  console.log('Evento @change disparado con:', event)
}
const updateDateRange = (newDateRange) => {
  console.log('update:modelValue disparado con:', newDateRange)
  eventStore.eventDate = newDateRange
}
// Función para manejar cambios de input
const onInputDateChange = (event) => {
  console.log('Evento @input disparado con:', event)
}

</script>