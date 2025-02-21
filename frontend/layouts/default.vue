<template>
  <div class="flex flex-col min-h-screen bg-background text-secondary">
    <NavBar />
    <div class="flex flex-col md:flex-row">
      <div class="hidden md:block flex-grow">
        <!-- SECCIÓN PARA BANNER IZQUIERDO -->
      </div>
      <main class="flex-grow w-full max-w-[1240px]">
        <NuxtPage class="flex-grow"/>
        <CookieBanner />
      </main>
      <div class="hidden md:block flex-grow">
        <!-- SECCIÓN PARA BANNER DERECHO -->
      </div>
    </div>
    <Footer />
    <ScrollButton/>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'scroll-to-top' // Debe coincidir con el nombre del archivo
})
</script>
