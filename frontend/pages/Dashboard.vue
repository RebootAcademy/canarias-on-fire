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

onMounted(async () => {
  if (isAuthenticated.value && user.value) {
    console.log('User:', user.value)
    roles.value = user.value['https://localhost:3000/roles'] || []
    console.log('Roles:', roles.value)

    const userData = {
      email: user.value.email,
      username: user.value.nickname,
      role: 'basic'
    }

    try {
      const { data, error } = await useFetch(`${config.public.apiBaseUrl}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

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