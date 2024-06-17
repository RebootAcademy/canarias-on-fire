import { createAuth0 } from '@auth0/auth0-vue'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  if (process.client) {
    nuxtApp.vueApp.use(
      createAuth0({
        domain: config.public.auth0Domain,
        clientId: config.public.auth0ClientId,
        redirect_uri: window.location.origin,
      })
    )
  }
})
