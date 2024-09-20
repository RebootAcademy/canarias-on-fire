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
          :v-model="modelToSelect()" 
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
const editingDate = ref('')

const props = defineProps({
  band: {
    typeof: Boolean,
    default: false
  },
  isEditing: {
    typeof: Boolean, 
    default: false
  }
})

const modelToSelect = () => {
  return props.isEditing ? editingDate.value : eventStore.eventDate
}

const formattedDate = computed(() => {
  if (!eventStore.eventDate) return ''
  if (props.isEditing && !editingDate.value) return new Date (eventStore.eventDate.year, eventStore.eventDate.month - 1, eventStore.eventDate.day).toLocaleDateString()
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
