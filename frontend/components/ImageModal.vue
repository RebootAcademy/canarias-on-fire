<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]"
  >
    <div class="relative max-w-[90vw] max-h-[90vh]">
      <NuxtImg
        :src="imageUrl"
        ref="imgRef"
        @load="onImageLoad"
        :style="{
          height: autoHeight ? autoHeight + 'px' : 'auto',
        }"
        class="rounded-lg object-contain w-full h-auto"
      />

      <!-- Botón en la esquina de la imagen -->
      <button
        @click="closeModal"
        class="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full px-3 py-1"
      >
        x
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  imageUrl: String,
})

const emit = defineEmits(['close'])
const closeModal = () => emit('close')

const imgRef = ref(null)
const autoHeight = ref(null)

const onImageLoad = () => {
  const el = imgRef.value?.$el
  if (el instanceof HTMLImageElement) {
    const { naturalWidth, naturalHeight } = el
    const aspectRatio = naturalWidth / naturalHeight

    const maxWidth = window.innerWidth * 0.9
    const maxHeight = window.innerHeight * 0.9

    let scaledHeight = maxWidth / aspectRatio
    if (scaledHeight > maxHeight) {
      scaledHeight = maxHeight
    }

    autoHeight.value = scaledHeight
  }
}
</script>
