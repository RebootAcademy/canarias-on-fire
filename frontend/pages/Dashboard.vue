<template>
  <div>
    <Profile v-if="roles.includes('basic')" />
    <AdminDashboard v-if="roles.includes('admin')" />
    <CompanyDashboard v-if="roles.includes('company')" />
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'

const { user, isAuthenticated } = useAuth0()

const roles = useState('roles', () => [])
const config = useRuntimeConfig()

if (isAuthenticated.value && user.value) {
  roles.value = user.value['https://localhost:3000/roles'] || []
  
  const userData = {
    email: user.value.email,
    username: user.value.nickname,
    role: 'basic'
  }

  const { data, error } = await useAsyncData('registerUser', () => $fetch(`${config.public.apiBaseUrl}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json'
    }
  })) 

  if (error.value) {
    console.error('Error registering user in the backend:', error.value)
  } else {
    console.log('User registered in the backend', data.value)
  }
}

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Dashboard'
})

</script>