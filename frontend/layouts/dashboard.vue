<template>
  <div class="flex flex-col min-h-screen bg-background text-secondary">
    <NavBar />
    <main class="flex-grow w-full">
      <div class="flex flex-col min-h-screen px-4 md:px-8 py-8 md:py-12">
        <!-- Header -->

        <div class="">
          <breadcrumbs />
        </div>
        <div
          class="flex items-center flex-col gap-4 md:gap-8 lg:flex-row lg:items-start"
        >
          <!-- Sidebar -->
          <CustomSidebar :links="optionsDashboard" :userRole="userRole" />

          <!-- Main content -->
          <main class="w-full md:flex-1 p-4 md:p-8">
            <NuxtPage />
          </main>
        </div>
      </div>
    </main>
    <Footer />
    <ScrollButton />
  </div>
</template>

<script setup>
const userStore = useUserStore()
const { t } = useI18n()
const userRole = computed(() => userStore.userData?.role)

const optionsDashboard = computed(() => {
  return [
    {
      label: t('dashboardNav.events'),
      path: '/dashboard/events',
      roles: ['admin', 'company'],
    },
    {
      label: t('dashboardNav.promotions'),
      path: '/dashboard/promotions',
      roles: ['admin', 'company'],
    },
    {
      label: t('dashboardNav.articles'),
      path: '/dashboard/articles',
      roles: ['admin'],
    },
    {
      label: t('dashboardNav.users'),
      path: '/dashboard/users',
      roles: ['admin'],
    },
    {
      label: t('dashboardNav.payments'),
      path: '/dashboard/payments',
      roles: ['company'],
    },
    {
      label: t('dashboardNav.statistics'),
      path: '/dashboard/statistics',
      roles: ['admin'],
    },
    {
      label: t('dashboardNav.profile'),
      path: '/dashboard/profile',
      roles: ['all'],
    },
    {
      label: t('dashboardNav.password'),
      path: '/dashboard/password',
      roles: ['admin', 'company', 'bands'],
    },
  ]
})

onMounted(() => {
  userStore.fetchAndSetUser(userStore.userData.email)
})

useHead({
  title: 'Dashboard',
})
</script>
