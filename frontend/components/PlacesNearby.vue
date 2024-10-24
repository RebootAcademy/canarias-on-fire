<template>
  <div
    class="flex flex-col w-full gap-4 lg:px-6"
    
  >
    <div class="flex flex-col justify-center items-center gap-2">
      <ButtonGeolocation @update:places="handlePlaces" v-if="placesToShow.length === 0"/>
    </div>
    <div v-if="placesToShow.length > 0" class="py-4">
      <p class="text-primary text-2xl lg:text-[38px] font-bold">{{ $t('promotions.nearbyPromoTitle')}}</p>
      <p class="md:text lg:text-2xl my-4">{{ $t('promotions.nearbyPromoDescription')}}</p>
       <div
      v-if="placesToShow.length > 0"
      class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-4"
    >
      <div
        v-for="promotion in limitedPlaces"
        :key="promotion?._id"
        class=" rounded-md"
      >
        <PromotionCard
          :promotion="promotion"
          :calculatedDist="true"
          :dist="(promotion?.dist.calculated / 1000).toFixed(2)"
        />
      </div>
    </div>
    <div  class="mt-6 text-center">
      <NuxtLink to="/promotions">
        <Button variant="outline" class="lg:text-lg hover:bg-primary-gradient hover:border-none">
          {{ $t('buttons.seeMore')}}
        </Button>
      </NuxtLink>
    </div>  
    </div>
  </div>
</template>

<script setup>
const placesToShow = ref([])

const limitedPlaces = computed(() => {
  if (!placesToShow.value) {
    return []
  }
  return placesToShow.value?.slice(0, 9)
})

const handlePlaces = (data) => {
  placesToShow.value = data
}

</script>

<style scoped>
.customScrollBar {
  cursor: pointer;
  scroll-behavior: smooth;
}

.customScrollBar::-webkit-scrollbar {
  height: 8px;
}

.customScrollBar::-webkit-scrollbar-track {
  background: none; /* Color del fondo del track */
}

.customScrollBar::-webkit-scrollbar-thumb {
  background-color: #fbb03b; /* Color del thumb (la parte que se arrastra) */
  border-radius: 10px; /* Redondeo del thumb */
}

.customScrollBar::-webkit-scrollbar-thumb:hover {
  background: #f15a24; /* Color del thumb al hacer hover */
}
</style>