<template>
  <div class="w-full flex flex-col justify-center items-center">
    <h1>Admin Dashboard</h1>
    <div class="flex flex-wrap">
      <div class="w-full h-64 border">Stats</div>
      <div class="w-1/2 h-40 border">Manage Users</div>
      <div class="w-1/2 h-40 border">Manage Articles</div>
      <div class="w-1/2 h-64 border">Manage Events</div>
      <div class="w-1/2 border">Manage Suscriptions</div>
      <div class="w-full h-32 border">Notifications</div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default',
})

useHead({
  title: 'Admin Dashboard'
})
</script>
