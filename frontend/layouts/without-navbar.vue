<template>
  <div class="flex flex-col min-h-screen">
    <main class="flex-grow w-full flex items-center">
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Footer from '~/components/Footer.vue'
</script>