import { useAuth0 } from '@auth0/auth0-vue'

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const { isAuthenticated } = useAuth0()

    if (!isAuthenticated.value) {
      return navigateTo('/')
    }
  }
})
