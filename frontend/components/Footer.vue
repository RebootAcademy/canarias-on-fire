<template>
  <div class="h-44 bg-background flex flex-col items-center justify-evenly text-secondary text-xs">
    <div class="flex space-x-4">
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <Twitter class="w-6 h-6 text-secondary" />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        <Instagram class="w-6 h-6 text-secondary" />
      </a>
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <Facebook class="w-6 h-6 text-secondary" />
      </a>
    </div>
    <div class="flex flex-wrap place-items-center justify-center gap-4 sm:gap-0 space-x-4 text-sm md:text-base ">
      <a href="/contact" class="hover:underline">
        <span class="text-secondary hover:text-primary">
          {{ $t('footer.contactUs') }}
        </span>
      </a>
      <a href="/about" class="hover:underline">
        <span class="text-secondary hover:text-primary">
          {{ $t('footer.aboutUs') }}
        </span>
      </a>
      <a href="/privacy-policy" class="hover:underline">
        <span class="text-secondary hover:text-primary">
          {{ $t('footer.privacy') }}
        </span>
      </a>
    </div>
    <div class="text-xs md:text-md">{{ $t('footer.copyright') }}</div>
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