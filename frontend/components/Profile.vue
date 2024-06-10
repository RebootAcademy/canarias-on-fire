<template>
  <div>
    <h1>Profile</h1>
    <pre v-if="isAuthenticated">
      <code>{{ user }}</code>
    </pre>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'

definePageMeta({
  layout: 'default',
})

useHead({
  title: 'My Profile'
})

let user
let isAuthenticated

onMounted(() => {
  const auth0 = useAuth0()
  isAuthenticated = auth0.isAuthenticated
  user = auth0.user
})
</script>