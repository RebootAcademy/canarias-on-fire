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

const { user, isAuthenticated } = useAuth0()

</script>