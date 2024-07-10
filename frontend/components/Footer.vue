<template>
  <div class="h-44 bg-black flex flex-col items-center justify-evenly text-gray-200 text-xs">
    <div class="flex space-x-4">
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <Twitter class="w-6 h-6" />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        <Instagram class="w-6 h-6" />
      </a>
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <Facebook class="w-6 h-6" />
      </a>
    </div>
    <div class="flex space-x-4 text-base">
      <a href="/contact" class="hover:underline">Contact us</a>
      <a href="/about" class="hover:underline">About Us</a>
      <a href="/privacy-policy" class="hover:underline">Policy of privacy</a>
    </div>
    <div>Copyright © 2024 Canarias On Fire - All rights reserved</div>
  </div>
</template>

<script setup>
import { Twitter, Instagram, Facebook } from 'lucide-vue-next'
</script>

<style scoped>
a {
  color: #ffffff;
}
a:hover {
  color: #cccccc;
}
</style>