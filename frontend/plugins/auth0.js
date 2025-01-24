import { createAuth0 } from '@auth0/auth0-vue'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()

  if (process.client) {
    const auth0 = createAuth0({
      domain: config.public.auth0Domain,
      clientId: config.public.auth0ClientId,
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: `https://${config.public.auth0Domain}/api/v2/`,
      },
      useRefreshTokens: true,
      cacheLocation: 'localstorage',
    })

    nuxtApp.vueApp.use(auth0)

    const { getAccessTokenSilently, isAuthenticated } = auth0

    // Silent authentication to restore the session
    try {
      await getAccessTokenSilently()
    } catch (error) {
      console.error('Silent authentication failed:', error)
    }
  }
})
