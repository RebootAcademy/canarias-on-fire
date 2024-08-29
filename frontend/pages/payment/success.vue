<template>
  <div>
    <h1>Suscripción Exitosa</h1>
    <p>Gracias por suscribirte. Estamos procesando tu pago.</p>
    <NuxtLink to="/">Volver a la página principal</NuxtLink>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(async () => {
  const sessionId = route.query.session_id
  if (sessionId) {
    // Aquí puedes hacer una llamada a tu API para verificar el estado de la sesión
    console.log('Session ID:', sessionId)
    // Implementa la lógica para verificar el estado de la sesión y actualizar la UI
  }
})
</script>