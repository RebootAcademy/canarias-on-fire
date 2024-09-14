<template>
  <div>
    <GMapAutocomplete
      v-model="eventStore.eventLocation"
      ref="autocompleteInput"
      class="bg-gray text-sm p-2 rounded-md w-full lg:w-1/2"
      :placeholder="$t('location')"
      @place_changed="setPlace"
    >
    </GMapAutocomplete>
    <div class="w-full h-80 lg:h-[500px] py-6">
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
const eventStore = useEventStore()
const emit = defineEmits(['locationChanged'])

const setPlace = (place) => {
  if (place && place.geometry) {
    eventStore.setPlaceDetails(place)
    eventStore.setMapCenter(place.geometry.location.lat(), place.geometry.location.lng())
    eventStore.eventLocation.address = place.formatted_address 

    eventStore.eventLocation.mapImageUrl = eventStore.generateMapImageUrl(
      place.geometry.location.lat(),
      place.geometry.location.lng()
    )

    emit('locationChanged', {
      address: eventStore.eventLocation.address,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      mapImageUrl: eventStore.eventLocation.mapImageUrl
    })

  } else {
    eventStore.eventLocation.address = ''
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