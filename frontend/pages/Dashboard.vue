<template>
  <div>
    <h1>My Dashboard</h1>
    <pre v-if="isAuthenticated">
      <code>{{ user }}</code>
    </pre>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
const { user, isAuthenticated } = useAuth0()

definePageMeta({
  middleware: 'auth',
  layout: 'default',
})

useHead({
  title: 'Dashboard'
})

</script>

/* Continuamos. Ya hace el flujo básico de login y logout de la aplicación. Ahora viene el siguiente paso. Conectarlo con mi backend.  */