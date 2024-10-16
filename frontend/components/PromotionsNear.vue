<template>
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
  >
    <PromotionCard
      v-for="promotion in placesNearbyMe"
      :key="promotion?._id"
      :promotion="promotion"
      :calculatedDist="true"
      :dist="(promotion?.dist.calculated / 1000).toFixed(2)"
    />
  </div>
</template>

<script setup>
const placesNearbyMe = ref([])
const loading = ref(true) // Estado de carga
const eventStore = useEventStore()
const searchCloserPlaces = () => {
   if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        console.log("La geolocalización no es compatible con este navegador.");
    }
}

const successCallback = (position) => {
  const latitude = position.coords.latitude
  const longitude = position.coords.longitude
  getNearbyPlaces(latitude, longitude);
}

const errorCallback = (error) => {
  console.error(`Error obteniendo la geolocalización: ${error.message}`)
}

const getNearbyPlaces = async (latitude, longitude) => {
    try {
        loading.value = true
        const response = await fetch(`${useRuntimeConfig().public.apiBaseUrl}/events/geolocation?lat=${latitude}&lng=${longitude}`);
        const data = await response.json()
        eventStore.setPromotionsNearMe(data.result)
        placesNearbyMe.value = data.result
    } catch (error) {
        console.error('Error al obtener lugares cercanos:', error);
    } finally {
        loading.value = false
    }
}


onMounted(() => {
  if (eventStore.promotionsNearMe.length === 0) {
    searchCloserPlaces()
  } else {
    placesNearbyMe.value = eventStore.promotionsNearMe
  }
})


</script>