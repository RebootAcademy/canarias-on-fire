<template>
  <div class="flex h-screen flex-col gap-8 items-center justify-center ">
    <h1 class="text-3xl ">{{  $t('successView.subscriptionTitle') }}</h1>
    <NuxtLink to="/">
      <div class="bg-primary-gradient p-4 px-8 font-bold rounded-md hover:opacity-90">
        {{ $t('buttons.backHome') }}
      </div>
    </NuxtLink>
  </div>
</template>

<script setup>
</script>


