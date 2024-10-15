<template>
  <div
    class="flex flex-col w-full gap-4  rounded p-4"
    :class="placesToShow.length > 0 ? 'border-dotted border-2 border-gray' : ''"
  >
    <div class="flex justify-center">
      <ButtonGeolocation @update:places="handlePlaces" />
    </div>
    <p v-if="placesToShow.length > 0">Lugares cercanos</p>
    <!-- Mobile Device -->
     <div v-if="placesToShow.length > 0" class="md:hidden">
      <div 
        class="flex customScrollBar overflow-x-auto snap-x snap-mandatory scroll-smooth gap-4 p-2" 
        :class="placesToShow.length === 1 ? 'justify-center' : ''"
      >
        <div
          v-for="promotion in placesToShow"
          :key="promotion?._id"
          class="min-w-[200px] max-w-[300px] p-4 flex-shrink-0 rounded-md"
        >
          <PromotionCard
            :promotion="promotion"
            :calculatedDist="true"
            :dist="(promotion?.dist.calculated / 1000).toFixed(2)"
          />
        </div>
      </div>
    </div>

    <!-- Tablet & Desktop Device -->
    <div
      v-if="placesToShow.length > 0"
      class=" hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="promotion in placesToShow"
        :key="promotion?._id"
        class="p-4 rounded-md"
      >
        <PromotionCard
          :promotion="promotion"
          :calculatedDist="true"
          :dist="(promotion?.dist.calculated / 1000).toFixed(2)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const placesToShow = ref([])

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