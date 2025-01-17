<template>
  <div class="flex flex-col min-h-screen bg-background text-secondary">
    <NavBar />
    <main class="flex-grow w-full">
      <div class="flex flex-col min-h-screen md:px-8 py-4 md:py-6">
        <div class="flex w-full flex-col xl:flex-row lg:items-start">
          <CustomSidebar :links="pricingOptions" :userRole="userRole" />
          <main class="w-full md:flex-1 md:p-8">
            <h1 class="text-primary text-2xl lg:text-[38px] text-center font-bold">
              {{ title }}
            </h1>
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
const route = useRoute()

const title = computed(() => {
  if (route.path === '/pricing/events') {
    return t('plansSection.title2')
  }
  return t('plansSection.title')
})

const pricingOptions = computed(() => {
  return [
    {
      label: t('plansSection.PromoSubscription'),
      path: '/pricing/promotions',
      roles: ['all'],
    },
    {
      label: t('plansSection.eventPayments'),
      path: '/pricing/events',
      roles: ['all'],
    },
  ]
})


const headTitle = computed(() => {
  return t('plansName.plansInfo')
})

watch(() => route.path, (newPath) => {
})

onMounted(async() => {
  await userStore.fetchAndSetUser(userStore.userData.email)
})

useHead({
  title: headTitle,
})
</script>
