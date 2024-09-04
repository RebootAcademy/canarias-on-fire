<template>
  <div class="flex flex-col min-h-screen bg-black">
    <NavBar />
    <main class="flex-grow w-full">
      <div class="flex flex-col min-h-screen px-8 py-12">
    <!-- Header -->
    
    <div class="">
      <h1 class="text-2xl text-primary font-bold">Dashboard</h1>
      <p class="text-sm text-gray-500 mb-4">Manage On Fire settings and users accounts</p>
      <hr class="mb-8">
    </div>
    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 p-4">
        <nav class="space-y-4">
          <ul class="space-y-2">
            <li><NuxtLink to="/dashboard/statistics" active-class="border border-primary" class="block py-2 px-4 rounded-md bg-gray">Statistics</NuxtLink></li>
            <li><NuxtLink to="/dashboard/events" active-class="border border-primary" class="block py-2 px-4 rounded-md bg-gray">Events</NuxtLink></li>
            <li><NuxtLink to="/dashboard/articles" active-class="border border-primary" class="block py-2 px-4 rounded-md bg-gray">Articles</NuxtLink></li>
            <li><NuxtLink to="/dashboard/users" active-class="border border-primary" class="block py-2 px-4 rounded-md bg-gray">Users list</NuxtLink></li>
            <li><NuxtLink to="/dashboard/profile" active-class="border border-primary" class="block py-2 px-4 rounded-md bg-gray">Profile</NuxtLink></li>
            <li><NuxtLink to="/dashboard/password" active-class="border border-primary" class="block py-2 px-4 rounded-md bg-gray">Password</NuxtLink></li>
          </ul>
        </nav>
      </aside>
  
      <!-- Main content -->
      <main class="flex-1 p-8">
        <NuxtPage />
      </main>
    </div>
  </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
useHead({
  title: 'Admin Dashboard'
})
</script>