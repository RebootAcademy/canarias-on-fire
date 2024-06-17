<template>
  <div>
    <label for="location" class="font-medium">Location</label>
    <input
      ref="autocompleteInput"
      id="location"
      type="text"
      class="p-2 border rounded w-full"
      placeholder="Enter a location"
    />
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'
import { Loader } from '@googlemaps/js-api-loader'

const eventStore = useEventStore()
const autocompleteInput = ref(null)

const initAutocomplete = () => {
  const loader = new Loader({
    apiKey: 'YOUR_GOOGLE_API_KEY', // Reemplaza con tu clave de API
    libraries: ['places']
  })

  loader.load().then(() => {
    const autocomplete = new google.maps.places.Autocomplete(autocompleteInput.value, {
      types: ['geocode']
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (place.geometry) {
        eventStore.eventLocalization = place.formatted_address
      }
    })
  })
}

onMounted(() => {
  initAutocomplete()
})
</script>