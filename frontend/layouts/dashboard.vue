<template>
  <div class="flex flex-col min-h-screen bg-black">
    <NavBar />
    <main class="flex-grow w-full">
      <div class="flex flex-col min-h-screen px-8 py-12">
    <!-- Header -->
    
    <div class="">
      <breadcrumbs />
    </div>
    <div class="flex items-center flex-col lg:flex-row lg:items-start ">
      <!-- Sidebar -->
      <aside class="flex flex-wrap items-center lg:flex-col lg:w-64 p-4 lg:mt-8">
        <nav class="flex w-full ">
          <ul class=" flex flex-wrap items-center justify-center gap-2 lg:flex-col lg:items-stretch lg:w-full">
            <li v-if="validateRole(['admin', 'company'], userRole)">
              <NuxtLink 
                to="/dashboard/events" 
                active-class="border border-primary" 
                class="block py-2 px-4 rounded-md bg-gray"
                >
                {{ userRole === 'admin' ? $t('dashboardNav.events') : $t('dashboardNav.myEvents') }}
              </NuxtLink>
            </li>
            <li v-if="validateRole(['admin'], userRole)">
              <NuxtLink 
                to="/dashboard/articles" 
                active-class="border border-primary" 
                class="block py-2 px-4 rounded-md bg-gray"
              >
              {{$t('dashboardNav.articles')}}
              </NuxtLink>
            </li>
            <li v-if="userRole === 'admin'">
              <NuxtLink 
                to="/dashboard/users" 
                active-class="border border-primary" 
                class="block py-2 px-4 rounded-md bg-gray"
              >
                {{ $t('dashboardNav.users') }}
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
      <main class="w-full md:flex-1 p-8">
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
  title: 'Dashboard'
})
</script>