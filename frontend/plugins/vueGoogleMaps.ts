import VueGoogleMaps from "@fawmi/vue-google-maps"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueGoogleMaps, {
    load: {
      key: "AIzaSyCEYGeiUj8NJAqKsh4Eo2kgdnMniVXWZr0",
      libraries: "places", // This is required if you use the Autocomplete plugin
    },
    autobindAllEvents: true,
  })
})