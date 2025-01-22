<template>
  <div>
    <Select 
      v-model="selected" 
      @update:modelValue="emitSelected" 
      required
    >
      <SelectTrigger>
        <SelectValue
          :placeholder="placeholder"
          class="text-gray-500"
        />
      </SelectTrigger>
      <SelectContent class="text-gray-500">
        <SelectItem v-for="(item, idx) in items" :value="item.value" :key="idx">
          {{ item.label }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup>
const emits = defineEmits(['update:selected'])
const eventStore = useEventStore()
const props = defineProps({
  items: Array,
  placeholder: String,
  optionDefault: {
    type: String,
    default: ''
  },
  isEditing: {
    type: Boolean,
    default: false
  }
})
const selected = ref(props.isEditing ? eventStore.event?.payment?.name : props.optionDefault)

const emitSelected = (value) => {
  emits('update:selected', value)
}

onMounted(() => {
  if (props.isEditing) {
    eventStore.adminPayment = eventStore.event?.payment?.name
  }
})
</script>
