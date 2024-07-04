<template>
  <div>
    <GMapAutocomplete
      v-model="eventStore.eventLocation"
      ref="autocompleteInput"
      class="text-sm p-2 border rounded-md w-full"
      :placeholder="$t('location')"
      @place_changed="setPlace"
    >
    </GMapAutocomplete>
    <div class="w-full h-60 py-6">
      <GMapMap 
        :center="eventStore.mapCenter"
        :zoom="18"
        :options="{
          disableDefaultUI: true,
          draggable: false,
          scrollwheel: false,
          disableDoubleClickZoom: true,
          zoomControl: false,
        }"
      >
        <GMapMarker :position="eventStore.mapCenter" />
      </GMapMap>
    </div>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()

const setPlace = (place) => {
  console.log(place)
  if (place && place.geometry) {
    eventStore.setPlaceDetails(place)
    eventStore.setMapCenter(place.geometry.location.lat(), place.geometry.location.lng())
  } else {
    console.error('No place details available')
  }
}

const setCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        eventStore.setMapCenter(position.coords.latitude, position.coords.longitude)
        eventStore.setMapImageUrl(position.coords.latitude, position.coords.longitude)
      },
      (error) => {
        console.error('Error getting current location:', error)
      }
    )
  } else {
    console.error('Geolocation is not supported by this browser.')
  }
}

onMounted(() => {
  setCurrentLocation()
})


</script>