<template>
  <div>
    <Label 
      for="eventDate" 
      :class="props.band ? 'text-md' : 'text-sm'"
    >
    {{ endDate ? $t('eventEndDate') : $t('eventDate') }}
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
const {t} = useI18n
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
  },
  endDate: {
    type: Boolean,
    default: false
  }
})

/* const modelToSelect = () => {
  if (props.endDate) return eventStore.eventEndDate
  if (props.isEditing && props.endDate) return editingDate.value
  return props.isEditing ? editingDate.value : eventStore.eventDate
}
 */
const modelToSelect = () => {
  if (props.endDate) {
    return props.isEditing ? editingDate.value : eventStore.eventEndDate
  }
  return props.isEditing ? editingDate.value : eventStore.eventDate
}

const formattedDate = computed(() => {
  if (props.endDate) {
    if (!eventStore.eventEndDate) return ''
    
    if (props.isEditing) {
      if (!editingDate.value) {
        const { year, month, day } = eventStore.eventEndDate || {}
        return year ? new Date(year, month - 1, day).toLocaleDateString() : ''
      }
      return new Date(editingDate.value).toLocaleDateString()
    }

    const { year, month, day } = eventStore.eventEndDate || {}
    return year ? new Date(year, month - 1, day).toLocaleDateString() : ''
  }

  if (!eventStore.eventDate) return ''
  
  if (props.isEditing) {
    if (!editingDate.value) {
      const { year, month, day } = eventStore.eventDate || {}
      return year ? new Date(year, month - 1, day).toLocaleDateString() : ''
    }
    return new Date(editingDate.value).toLocaleDateString()
  }

  const { year, month, day } = eventStore.eventDate || {}
  return year ? new Date(year, month - 1, day).toLocaleDateString() : ''
})

const updateDate = (newDate) => {
  if (props.endDate) {
    // Caso 2: Validar que la fecha final no sea anterior a la de inicio
    if (newDate < eventStore.eventDate) {
      dateError.value = t('eventEndDateError')
      return
    }
    eventStore.eventEndDate = newDate
  } else {
    eventStore.eventDate = newDate
  }
  
  if (props.band) {
    emit('dateChanged', eventStore.eventDate)
  }
  
  dateError.value = ''
}
const isDisabledDate = (date) => {
  if (today > date) return true
}

watch(() => props.isEditing, (newVal) => {
  if (newVal && props.endDate) {
    editingDate.value = eventStore.eventEndDate
  } else if (newVal) {
    editingDate.value = eventStore.eventDate
  }
})
</script>
