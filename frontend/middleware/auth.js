import { useAuth0 } from '@auth0/auth0-vue'

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const { isAuthenticated } = useAuth0()
    console.log('User is authenticated:', isAuthenticated.value)

    if (!isAuthenticated.value) {
      return navigateTo('/')
    }
  }
})
