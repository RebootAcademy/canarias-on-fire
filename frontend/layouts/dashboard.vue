<template>
  <div class="flex flex-col min-h-screen">
    <NavBar />
    <main class="flex-grow w-full">
      <div class="flex flex-col min-h-screen px-8 py-12">
    <!-- Header -->
    
    <div class="">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-sm text-gray-500 mb-4">Manage On Fire settings and users accounts</p>
      <hr class="mb-8">
    </div>
    <div class="flex">
      <!-- Sidebar -->
      <aside class="w-64 p-4">
        <nav class="space-y-4">
          <ul class="space-y-2">
            <li><NuxtLink to="/dashboard/statistics" active-class="bg-gray-300" class="block py-2 px-4 rounded hover:bg-gray-100">Statistics</NuxtLink></li>
            <li><NuxtLink to="/dashboard/events" active-class="bg-gray-300" class="block py-2 px-4 rounded hover:bg-gray-100">Events</NuxtLink></li>
            <li><NuxtLink to="/dashboard/articles" active-class="bg-gray-300" class="block py-2 px-4 rounded hover:bg-gray-100">Articles</NuxtLink></li>
            <li><NuxtLink to="/dashboard/users" active-class="bg-gray-300" class="block py-2 px-4 rounded hover:bg-gray-100">Users list</NuxtLink></li>
            <li><NuxtLink to="/dashboard/profile" active-class="bg-gray-300" class="block py-2 px-4 rounded hover:bg-gray-100">Profile</NuxtLink></li>
            <li><NuxtLink to="/dashboard/password" active-class="bg-gray-300" class="block py-2 px-4 rounded hover:bg-gray-100">Password</NuxtLink></li>
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