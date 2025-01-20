<template>
  <div class="flex !flex-col min-h-screen bg-background text-secondary">
    <NavBar />
    <main class="flex-grow w-full">
      <NuxtPage class="flex-grow"/>
      <CookieBanner />
    </main>
    <Footer />
    <ScrollButton/>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'scroll-to-top' // Debe coincidir con el nombre del archivo
})
</script>
