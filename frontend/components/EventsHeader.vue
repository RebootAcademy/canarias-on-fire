<template>
  <div class="flex flex-col items-center p-6">
    <div class="flex items-center justify-between w-full px-4">
      <div>
        <p class="text-2xl font-medium">{{ $t('events') }}</p>
        <p class="text-xs text-gray-500">{{ $t('eventsDesc') }}</p>
      </div>
      <Button variant="ghost" class="font-light">
        <NuxtLink to="/events">
          Ver más
        </NuxtLink>
      </Button>

    </div>
    <hr class="w-full border-gray-300 mt-4" />
  </div>
</template>

<script setup>
 
</script>
