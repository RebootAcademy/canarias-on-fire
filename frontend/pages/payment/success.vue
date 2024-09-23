<template>
  <div class="flex h-screen flex-col gap-8 items-center justify-center ">
    <h1 class="text-3xl ">{{  $t('successView.title') }}</h1>
    <NuxtLink to="/">
      <div class="bg-primary-gradient p-4 px-8 font-bold rounded-md hover:opacity-90">
        {{ $t('buttons.backHome') }}
      </div>
    </NuxtLink>
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