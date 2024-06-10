<template>
  <div>
    <Profile v-if="roles.includes('basic')" />
    <AdminDashboard v-if="roles.includes('admin')" />
    <CompanyDashboard v-if="roles.includes('company')" />
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#app'

const roles = ref([])
const config = useRuntimeConfig()
const { user, isAuthenticated } = useAuth0()

console.log('https://dev-p4k5rijt4cde3pip.us.auth0.com/oauth/token')

onMounted(async () => {
  if (isAuthenticated.value && user.value) {
    roles.value = user.value['https://localhost:3000/roles'] || []

    const userData = {
      email: user.value.email,
      role: 'basic' // O el rol que desees asignar
    }

    try {
      const { data, error } = await useFetch(`${config.public.apiBaseUrl}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log(data)

      if (error.value) {
        console.error('Error registering user in the backend:', error.value)
      } else {
        console.log('User registered in the backend', data.value)
      }
    } catch (error) {
      console.error('Error registering user in the backend:', error)
    }
  }
})

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Dashboard'
})
</script>