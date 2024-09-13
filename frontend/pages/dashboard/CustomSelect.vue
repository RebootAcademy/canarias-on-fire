<template>
  <Select v-model="localSelectedOption" @change="onChange"> 
    <SelectTrigger>
      <SelectValue
        class="text-gray-500"
      >
       {{ computedSelection }}</SelectValue>
    </SelectTrigger>
    <SelectContent class="bg-whiteGray">
      <SelectItem 
        v-for="option in optionsFilters" 
        :key="option.label" 
		    :value="option.value"
        class="bg-gray text-white"
        >
        <SelectItemText>
          {{ option.label }}
        </SelectItemText>
      </SelectItem>
    </SelectContent>
  </Select>
</template>

<script setup>
const props = defineProps({
  selectOption: String,
  optionsFilters: Array
});

const emit = defineEmits(['update:selected']);


const localSelectedOption = ref(props.selectOption); 

const computedSelection = computed(() => {
  console.log('computed', localSelectedOption.value)
  return props.optionsFilters.find((option) => option.value === localSelectedOption.value).label
})

console.log('Soy el prop', props.selectOption)

console.log(localSelectedOption.value)

watch(localSelectedOption, (newValue) => {
  emit('update:selected', newValue);
});

const onChange = () => {
  if (localSelectedOption.value !== props.selectOption) {
    emit('update:selected', localSelectedOption.value);
  }
}

</script>
