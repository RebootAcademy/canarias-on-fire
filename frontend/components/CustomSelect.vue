<template>
  <div>
    <Select
      v-model="selected"
      @update:modelValue="emitSelected"
      required
    >
      <SelectTrigger
        v-if="isMusicSelected()"
        class="border border-primary  flex justify-center items-center"
      >
        <SelectValue :placeholder="placeholder" class="text-gray-500" />
      </SelectTrigger>
      <SelectContent class="text-gray-500">
        <SelectItem class="hover:bg-primary-gradient" v-for="(item, idx) in items" :value="item.value" :key="idx">
          {{ item.label }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>

<script setup>
const emits = defineEmits(['update:selected'])
const eventStore = useEventStore()
const { selectedCategories } = storeToRefs(eventStore)
const props = defineProps({
  items: Array,
  placeholder: String,
  optionDefault: {
    type: String,
    default: '',
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
})
const selected = ref(
  props.isEditing ? eventStore.event?.payment?.name : props.optionDefault
)

const emitSelected = (value) => {
  emits('update:selected', value)
}

onMounted(() => {
  if (props.isEditing) {
    eventStore.adminPayment = eventStore.event?.payment?.name
  }
})

const isMusicSelected = () => {
  return selectedCategories.value.some((c) => c.name === 'music')
}
</script>
