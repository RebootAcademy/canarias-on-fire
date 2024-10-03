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
const props = defineProps({
  items: Array,
  placeholder: String,
  optionDefault: {
    type: String,
    default: ''
  }
})
const selected = ref(props.optionDefault)

const emitSelected = (value) => {
  emits('update:selected', value)
}
</script>
