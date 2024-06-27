<template>
  <div>
    <GMapAutocomplete
      v-model="eventStore.eventLocation"
      ref="autocompleteInput"
      class="text-sm p-2 border rounded-md w-full"
      placeholder="Enter a location"
      @place_changed="setPlace"
    >
    </GMapAutocomplete>
    <div class="w-60 h-60">
      <GMapMap 
        :center="{lat: 51.093048, lng: 6.842120}"
        :zoom="7"
        class="width: 100%; height: 150%;"
      />
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
  } else {
    console.error('No place details available')
  }
}
</script>