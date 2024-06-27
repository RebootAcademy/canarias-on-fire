<template>
  <div>
    <!-- <Label for="location" class="font-medium text-xs text-gray-500">Location</Label> -->
    <GMapAutocomplete
      v-model="eventStore.eventLocation"
      ref="autocompleteInput"
      id="location"
      class="text-sm p-2 border rounded-md w-full"
      placeholder="Enter a location"
      @place_changed="setPlace"
    >
    </GMapAutocomplete>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()

function setPlace(place) {
  console.log(place)
  if (place && place.geometry) {
    eventStore.setPlaceDetails(place)
  } else {
    console.error('No place details available')
  }
}
</script>