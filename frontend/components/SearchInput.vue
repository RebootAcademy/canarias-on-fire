<template>
  <div class="relative cursor-pointer rounded-md">
    <Input
      v-model="searchQuery"
      :placeholder="$t('buttons.search')"
      class="bg-background border-primary pl-10 pr-4 rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full text-secondary active:border-primary"
      @input="updateValue"
    />
    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary">
      <SearchIcon size="18"/>
    </span>
  </div>
</template>

<script setup>
import { Search as SearchIcon } from 'lucide-vue-next'
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

// Crear una ref a partir de modelValue para vincular al input
const searchQuery = ref(props.modelValue)

// Emitir el cambio cada vez que searchQuery cambie
watch(searchQuery, (newValue) => {
  emit('update:modelValue', newValue)
})

// Verificar si modelValue cambia desde el padre y actualizar searchQuery
watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue
})

</script>

