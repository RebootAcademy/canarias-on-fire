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
            <li v-if="validateRole(['admin', 'company'], userRole)">
              <NuxtLink 
                to="/dashboard/events" 
                active-class="border border-primary" 
                class="block py-2 px-4 rounded-md bg-gray"
                >
                {{ userRole === 'admin' ? $t('dashboardNav.eventsAdmin') : $t('dashboardNav.myEvents') }}
              </NuxtLink>
            </li>
            <li v-if="validateRole(['admin'], userRole)">
              <NuxtLink 
                to="/dashboard/articles" 
                active-class="border border-primary" 
                class="block py-2 px-4 rounded-md bg-gray"
              >
              {{$t('dashboardNav.articlesAdmin')}}
              </NuxtLink>
            </li>
            <li v-if="userRole === 'admin'">
              <NuxtLink 
                to="/dashboard/users" 
                active-class="border border-primary" 
                class="block py-2 px-4 rounded-md bg-gray"
              >
                {{ $t('dashboardNav.usersList') }}
              </NuxtLink>
            </li>
            <li v-if="userRole === 'admin'">
              <NuxtLink 
                to="/dashboard/statistics" 
                active-class="border border-primary" 
                class="block py-2 px-4 rounded-md bg-gray"
              >
              {{ $t('dashboardNav.statistics') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/dashboard/profile" 
                active-class="border border-primary" 
                class="block py-2 px-4 rounded-md bg-gray"
              >
                {{ $t('dashboardNav.profile') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/dashboard/password" 
                active-class="border border-primary" 
                class="block py-2 px-4 rounded-md bg-gray"
              >
                {{ $t('dashboardNav.password') }}
              </NuxtLink>
            </li>
            <li v-if="userRole === 'company'">
              <NuxtLink 
                to="/dashboard/payments" 
                active-class="border border-primary" 
                class="block py-2 px-4 rounded-md bg-gray"
              >
                {{ $t('dashboardNav.payments') }}
              </NuxtLink>
          </li>
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
const userStore = useUserStore()

const userRole = computed(() => userStore.userData?.role)



useHead({
  title: 'Admin Dashboard'
})
</script>