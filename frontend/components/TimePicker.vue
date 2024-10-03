<template>
  <div class="w-4/5 text-gray-500">
    <Label 
      :for="id" 
      class="text-xs text-gray-500"
    >
      {{ label }}
    </Label>
    <Input 
      v-model="time" 
      :id="id" 
      type="time" 
      class="p-2 border rounded-md flex flex-row-reverse" 
    />
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  id: String,
  label: String,
  modelValue: String,
})

const eventStore = useEventStore()
const time = computed({
  get: () => eventStore[props.modelValue],
  set: (value) =>{ 
    emit('update:modelValue', value)
    eventStore[props.modelValue] = value
  }
})
</script>