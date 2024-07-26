<template>
  <div :class="containerClasses">
    <NuxtLink :to="adLink" target="_blank" rel="noopener noreferrer" class="block w-full h-full">
      <NuxtPicture
        :src="adImageSrc"
        :alt="adAltText"
        :width="dimensions.width"
        :height="dimensions.height"
        format="webp"
        loading="lazy"
        class="w-full h-full object-cover"
      />
    </NuxtLink>
  </div>
</template>

<script setup>
const props = defineProps({
  adLink: {
    type: String,
    required: true
  },
  adImageSrc: {
    type: String,
    required: true
  },
  adAltText: {
    type: String,
    default: 'Anuncio publicitario'
  },
  variant: {
    type: String,
    required: true,
    validator: (value) => ['horizontal', 'vertical', 'square'].includes(value)
  },
  size: {
    type: String,
    default: 'sm',
    validator: (value) => ['sm', 'lg'].includes(value)
  }
})

const dimensions = computed(() => {
  const sizes = {
    horizontal: { sm: { width: 300, height: 50 }, lg: { width: 728, height: 90 } },
    vertical: { sm: { width: 160, height: 600 }, lg: { width: 300, height: 600 } },
    square: { sm: { width: 250, height: 250 }, lg: { width: 336, height: 280 } }
  }
  return sizes[props.variant][props.size]
})

const containerClasses = computed(() => {
  const baseClasses = 'flex justify-center items-center my-4'
  const variantClasses = {
    horizontal: {
      sm: 'w-[300px] h-[50px]',
      lg: 'w-[728px] h-[90px]'
    },
    vertical: {
      sm: 'w-[160px] h-[600px]',
      lg: 'w-[300px] h-[600px]'
    },
    square: {
      sm: 'w-[250px] h-[250px]',
      lg: 'w-[336px] h-[280px]'
    }
  }
  return `${baseClasses} ${variantClasses[props.variant][props.size]}`
})


</script>