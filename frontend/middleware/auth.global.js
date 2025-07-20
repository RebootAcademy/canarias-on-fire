import { useAuth0 } from '@auth0/auth0-vue'
import { useUserStore } from '../stores/userStore'

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0()
    const userStore = useUserStore()
    const config = useRuntimeConfig()

    if (isAuthenticated.value && user.value && !userStore.isAuthenticated) {
      try {
        const token = await getAccessTokenSilently()
        const roles = user.value['https://evente.netlify.app/roles'] || []

        const userData = {
          email: user.value.email,
          username: user.value.nickname,
          role: roles[0],
          auth0Id: user?.value?.sub,
        }

        const response = await fetch(
          `${config.public.apiBaseUrl}/auth/register`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
          }
        )

        await userStore.fetchAndSetUser(user.value.email)

        if (!response.ok) {
        } else {
        }
      } catch (error) {
        console.error('Error registering user or fetching data:', error)
        // Considerar redirigir a una página de error o manejar este caso
      }
    }

    // Lógica de redirección basada en roles
    if (userStore.isAuthenticated) {
      const role = userStore.userData?.role
      if (role === 'basic' && to.path !== '/dashboard/onboarding') {
        return navigateTo('/dashboard/onboarding')
      } /* else if (['company', 'musician'].includes(role) && to.path !== '/dashboard') {
        return navigateTo('/dashboard')
      } */
    }
  }
})
