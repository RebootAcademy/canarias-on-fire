<template>
  <div class="carousel w-full h-44 relative overflow-hidden rounded-t-lg bg-[#1a1a1a] z-0">
    <div class="relative">
      <img
        :src="imageSrc"
        :class="`w-full h-44 ${isDefaultImage ? 'object-contain' : 'object-cover'}`"
      />
      <div v-if="promotionImage" class="absolute bg-primary rounded-full  top-[0.9rem] right-[1.3rem] w-[2.4rem] h-10"></div>
      <img
          v-if="promotionImage"
          :src="promotionImage"
          :alt="props.event?.eventDiscount"
          class="absolute top-2 right-2 w-16 h-16"
      />
      <div  v-if="typeof props.event?.eventDiscount === 'string' && props.event.eventDiscount.includes('%')"
        class="absolute top-2 right-2 bg-black h-12 w-12 border-2 border-primary rounded-full bg-primary-gradient flex justify-center items-center font-bold"
      ><span class="pointer-events-none text-black">{{props?.event?.eventDiscount}}</span>
      </div>
    </div>
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
import { ref, computed, watch } from 'vue';

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
const imageSrc = ref('')
const isDefaultImage = ref(false)


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
  return images.length > 0 ? images : [{ url: defaultImage }]
})

const loadImageWithFallback = (url) => {
  if (!url || url === defaultImage) {
    imageSrc.value = defaultImage;
    isDefaultImage.value = true;
    return;
  }

  let isHandled = false;
  const timeout = 10000; // 5 segundos de timeout

  const timeoutId = setTimeout(() => {
    if (!isHandled) {
      isHandled = true;
      imageSrc.value = defaultImage;
      isDefaultImage.value = true;
    }
  }, timeout);

  const img = new Image();
  img.onload = () => {
    if (!isHandled) {
      clearTimeout(timeoutId);
      isHandled = true;
      imageSrc.value = url;
      isDefaultImage.value = false;
    }
  };
  img.onerror = () => {
    if (!isHandled) {
      clearTimeout(timeoutId);
      isHandled = true;
      imageSrc.value = defaultImage;
      isDefaultImage.value = true;
    }
  };
  img.src = url;
};

watch(() => imagesToShow.value[currentImageIndex.value]?.url, (newUrl) => {
  loadImageWithFallback(newUrl);
}, { immediate: true });


watch(() => props.event.coverImage, (newUrl) => {
  if (newUrl && isDefaultImage.value) {
    loadImageWithFallback(newUrl);
  }
});


onMounted(() => {
  const realUrl = imagesToShow.value[currentImageIndex.value]?.url;
  if (isDefaultImage.value && realUrl && realUrl !== defaultImage) {
    loadImageWithFallback(realUrl);
  }
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


const onImageError = (event) => {
  event.target.src = defaultImage
}

const promotionImage = computed(() => {
  return promotionsOptions[props.event?.eventDiscount] || null;
});

const promotionsOptions = {
  '2x1': '/promotions/2x1.png',
  '3x1': '/promotions/3x1.png',
  '3x2': '/promotions/3x2.png',
}

</script>
