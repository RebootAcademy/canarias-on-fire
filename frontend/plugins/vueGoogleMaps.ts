import VueGoogleMaps from "@fawmi/vue-google-maps"

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const eventStore = useEventStore()

  eventStore.setGoogleMapsApiKey(config.public.googleMapsApiKey)

  nuxtApp.vueApp.use(VueGoogleMaps, {
    load: {
      key: config.public.googleMapsApiKey,
      libraries: "places",
    },
    autobindAllEvents: true,
  })
})