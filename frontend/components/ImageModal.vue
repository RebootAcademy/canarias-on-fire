<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div class="relative">
      <img :src="imageUrl" class="max-w-full max-h-full rounded-lg" />
      <button @click="closeModal" class="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2">x</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}
</script>