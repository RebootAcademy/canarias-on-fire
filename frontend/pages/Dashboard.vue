<template>
  <div>
    <Profile v-if="roles.includes('basic')" />
    <AdminDashboard v-if="roles.includes('admin')" />
    <CompanyDashboard v-if="roles.includes('company')" />
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'

const { user, isAuthenticated , getAccessTokenSilently} = useAuth0()
const config = useRuntimeConfig()
const userStore = useUserStore()

const roles = useState('roles', () => [])

if (isAuthenticated.value && user.value) {
  roles.value = user.value['https://localhost:3000/roles'] || []

  const userData = {
    email: user.value.email,
    username: user.value.nickname,
    role: roles.value[0] // Asumimos que el primer rol es el principal
  }

  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(`${config.public.apiBaseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    })

    if (!response.ok) {
      console.log('Failed to register user:', response.statusText)
    } else {
      console.log('User registered successfully')
      await userStore.fetchAndSetUser(user.value.email)
    }
  } catch (error) {
    console.log('Error registering user in the database:', error)
  }
}


definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Dashboard'
})

</script>