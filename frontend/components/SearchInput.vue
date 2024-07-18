<template>
  <div class="relative">
    <Input
      v-model="searchQuery"
      placeholder="Search"
      class="pl-10 pr-4 rounded-md bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-200"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
      <SearchIcon size="18" />
    </span>
  </div>
</template>

<script setup>
import { Search as SearchIcon } from 'lucide-vue-next'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const searchQuery = ref(props.modelValue)

watch(searchQuery, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>