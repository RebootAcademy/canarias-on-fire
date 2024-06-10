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

const roles = ref([])

let user
let isAuthenticated

onMounted(() => {
  const auth0 = useAuth0() 
  user = auth0.user
  isAuthenticated = auth0.isAuthenticated

  if (isAuthenticated.value && user.value) {
    roles.value = user.value['https://localhost:3000/roles'] || [];
  }
})

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Dashboard'
})
</script>
