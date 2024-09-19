<template>
  <div>
    <Label 
      for="eventDate" 
      :class="props.band ? 'text-md' : 'text-sm'"
    >
    {{ $t('eventDate') }}
  </Label>
    <Popover>
      <PopoverTrigger as-child>
        <Button
          variant="ghost"
          :class="cn('w-full bg-gray justify-start text-left', !formattedDate && 'text-muted-foreground')"
        >
          <CalendarIcon class="mr-2 h-4 w-4" />
          {{ formattedDate || $t('pickDate') }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <Calendar 
          v-model="eventStore.eventDate" 
          initial-focus 
          @update:model-value="updateDate" 
        />
      </PopoverContent>
    </Popover>
    <span v-if="dateError" class="text-red-500 text-xs mt-1">{{ dateError }}</span>
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-vue-next'
const today = new Date()
const eventStore = useEventStore()
const dateError = ref('')
const emit = defineEmits(['dateChanged'])

const props = defineProps({
  band: {
    typeof: Boolean,
    default: false
  }
})


const formattedDate = computed(() => {
  if (!eventStore.eventDate) return ''
  return new Date(eventStore.eventDate).toLocaleDateString()
})

const updateDate = (newDate) => {
  eventStore.eventDate = newDate
   if (props.band) {
    emit('dateChanged', eventStore.eventDate)
  }
}
const isDisabledDate = (date) => {
  if (today > date) return true
}
</script>
