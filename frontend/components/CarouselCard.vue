<template>
  <div class="carousel w-full h-44 relative overflow-hidden rounded-t-lg">
    <img
      :src="imagesToShow[currentImageIndex]?.url || defaultImage"
      class="w-full h-44 object-cover"
    />

    <!-- Flechas para cambiar de imagen -->
    <button
      v-if="imagesToShow.length > 1"
      @click="prevImage"
      class="absolute z-10 top-1/2 left-1 transform -translate-y-1/2 bg-[#a3a3a359] text-white py-2 px-3  rounded-full hover:bg-[#ff9a28da]"
    >
      &#10094; <!-- Flecha izquierda -->
    </button>
    <button
       v-if="imagesToShow.length > 1"
      @click="nextImage"
      class="absolute top-1/2 z-10 right-1 transform -translate-y-1/2 bg-[#a3a3a359] text-white py-2 px-3 rounded-full hover:bg-[#ff9a28da]"
    >
      &#10095; <!-- Flecha derecha -->
    </button>

    <!-- Indicadores de imágenes -->
    <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
      <span
        v-for="(image, index) in imagesToShow"
        :key="index"
        @click="goToImage(index)"
        class="block w-4 h-1 rounded-full"
        :class="{
          'bg-primary': index === currentImageIndex,
          'bg-white': index !== currentImageIndex
        }"
      ></span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    default: 'event',
  },
})

const defaultImage = '/defaultImg.png'

const currentImageIndex = ref(0)


const imagesToShow = computed(() => {
    const images = [];
     let filteredEventImages
  if (typeof props.event.coverImage === 'string') {
      images.push({ url: props.event.coverImage });
    }
  if (props.type === 'event') {
     filteredEventImages = props.event.eventImages.filter(image => image.url !== props.event.coverImage)
     images.push(...filteredEventImages);
  } else if (props.type === 'promotion') {
    filteredEventImages = props?.event?.eventImages?.filter(image => image.url !== props.event.coverImage) || []
     images.push(...filteredEventImages);
  } else {
    filteredEventImages = props.event.articleImages.filter(image => image.url !== props.event.coverImage)
     images.push(...filteredEventImages);
  }
  return images
})

// Función para ir a la imagen anterior
const prevImage = () => {
  currentImageIndex.value =
    currentImageIndex.value === 0
      ? imagesToShow.value.length - 1
      : currentImageIndex.value - 1
}

// Función para ir a la siguiente imagen
const nextImage = () => {
  currentImageIndex.value =
    currentImageIndex.value === imagesToShow.value.length - 1
      ? 0
      : currentImageIndex.value + 1
}

// Función para ir a una imagen específica
const goToImage = (index) => {
  currentImageIndex.value = index
  
}


</script>
