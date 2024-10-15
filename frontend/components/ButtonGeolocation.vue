<template>
  <button @click="searchCloserPlaces" class="offset bg-primary text-secondary px-4 py-2 rounded-full font-semibold ">
    Buscar Lugares
  </button>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['update:places'])

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
        const response = await fetch(`${useRuntimeConfig().public.apiBaseUrl}/events/geolocation?lat=${latitude}&lng=${longitude}`);
        const data = await response.json()
        emit('update:places', data.result)
    } catch (error) {
        console.error('Error al obtener lugares cercanos:', error);
    }
}
</script>


<style scoped>
button {
  background: none;
  font: inherit;
  border-radius: 20px;
  line-height: 1;
  margin: 0.5em;
  padding: 1em 2em;
}

button {  
  transition: 0.25s;
}

button:hover {
  color: black
}

.offset {  
  box-shadow: 
    0.3em 0.3em 0 0 #FBB03B,
    inset 0.3em 0.3em 0 0 #F7931E;
}

.offset:hover, .offset:focus  {
 
    box-shadow: 
      0 0 0 0 #F7931E,
      inset 6em 3.5em 0 0 #F7931E;

}
</style>