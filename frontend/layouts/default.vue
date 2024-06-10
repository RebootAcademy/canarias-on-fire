<template>
  <div class="flex flex-col min-h-screen">
    <NavBar />
    <main class="flex-grow w-full">
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup>
useHead({
  title: 'CanariasONFIRE'
})
</script>
