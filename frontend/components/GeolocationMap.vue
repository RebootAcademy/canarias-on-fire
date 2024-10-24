<template>
  <div class="md:ml-4 text-center md:text-start">
    <p class="mb-2">
     {{ $t('geolocation.area')}} {{ eventStore.radioLocation / 1000 }} km
    </p>
    <div
      class="flex flex-row items-center gap-4 border-2 border-primary p-2 rounded-lg hover:bg-primary-gradient"
    >
      <button @click="openMap">{{ $t('geolocation.changeArea')}}</button>
      <MapPinned />
    </div>

    <dialog
      ref="dialog"
      @close="closeMap"
      @click="handleDialogClick"
      class="custom-dialog w-[400px] rounded-lg p-4 shadow-lg"
    >
      <label for="distance" class="text-lg">{{ $t('geolocation.actionArea')}}</label>
      <select
        id="distance"
        v-model="eventStore.radioLocation"
        class="text-lg mb-2 p-2 rounded-md ml-2"
      >
        <option value="5000">{{ $t('geolocation.radius.5km')}}</option>
        <option value="10000">{{ $t('geolocation.radius.10km')}}</option>
        <option value="15000">{{ $t('geolocation.radius.15km')}}</option>
        <option value="20000">{{ $t('geolocation.radius.20km')}}</option>
        <option value="30000">{{ $t('geolocation.radius.30km')}}</option>
        <option value="40000">{{ $t('geolocation.radius.40km')}}</option>
        <option value="50000">{{ $t('geolocation.radius.50km')}}</option>
      </select>
      <div ref="mapElement" style="width: 100%; height: 400px"></div>
      <div class="flex justify-center">
        <button
          @click="closeMap"
          class="border-2 border-primary mt-4 p-2 rounded-md hover:text-white hover:bg-primary-gradient"
        >
          {{ $t('buttons.confirm') }}
        </button>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { MapPinned } from 'lucide-vue-next'
const eventStore = useEventStore()
const dialog = ref(null)
const mapElement = ref(null) // Asegúrate de que este ref esté definido aquí
const selectedDistance = ref(10000) // Valor inicial (5 km)
let circle = null
let map = null

const openMap = () => {
  dialog.value.showModal()
  nextTick(() => {
    loadGoogleMapsScript()
  })
}

const closeMap = () => {
  dialog.value.close()
  resetMap()

  if (map) {
    map = null
    if (circle) {
      circle.setMap(null)
      circle = null
    }
  }
}

const handleDialogClick = (event) => {
  if (event.target === dialog.value) {
    closeMap()
  }
}

const loadGoogleMapsScript = () => {
  if (!window.google) {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      useRuntimeConfig().public.googleMapsApiKey
    }&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => initializeMap()
    document.head.appendChild(script)
  } else {
    initializeMap()
  }
}

const initializeMap = () => {
  if (dialog.value.open && mapElement.value) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        )

        map = new google.maps.Map(mapElement.value, {
          center: userLocation,
          zoom: getZoomLevel(eventStore.radioLocation),
        })

        // Crear el círculo inicial
        circle = new google.maps.Circle({
          strokeColor: '#F7931E',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#F7931E',
          fillOpacity: 0.35,
          map: map,
          center: userLocation,
          radius: selectedDistance.value, // Radio inicial
        })

        // Agregar un marcador en la ubicación del usuario
        new google.maps.Marker({
          position: userLocation,
          map: map,
          title: 'Tu ubicación',
        })
      },
      (error) => {
        console.error('Error obteniendo la ubicación: ', error)
      }
    )
  } else {
    console.error(
      'mapElement no está disponible. Verifica si el ref está correctamente asignado.'
    )
  }
}

watch(
  () => eventStore.radioLocation,
  (newDistance) => {
    if (circle && map) {
      const radius = parseInt(newDistance)
      if (!isNaN(radius) && radius > 0) {
        circle.setRadius(radius)
        map.setZoom(getZoomLevel(radius))
      }
    }
  }
)

const getZoomLevel = (radius) => {
  if (radius <= 5000) return 12
  if (radius <= 10000) return 11
  if (radius <= 15000) return 10
  if (radius <= 20000) return 10
  if (radius <= 30000) return 9
  if (radius <= 40000) return 9
  if (radius <= 50000) return 8
  return 10
}

const resetMap = () => {
  if (circle) {
    circle.setMap(null) // Eliminar el círculo del mapa
    circle = null
  }
  map = null // Limpiar el objeto del mapa
}
</script>

<style scoped>
dialog {
  border: none;
  border-radius: 8px;
  padding: 20px;
}

.custom-dialog {
  border: 2px solid #F7931E; /* Asegúrate de usar el color adecuado aquí */
  padding: 14px; /* Padding adicional para separar el contenido del borde */
  box-sizing: border-box; /* Asegúrate de que el padding no se salga del borde */
}
</style>
