<template>
<div class="flex flex-col min-h-screen bg-background text-secondary">
    <NavBar />
    <main class="flex-grow w-full">
        <div class="flex flex-col min-h-screen px-8 py-6">

            <div class="flex items-center flex-col xl:flex-row lg:items-start ">      
              <!-- Sidebar -->
                <CustomSidebar :links="pricingOptions" :userRole="userRole" />
          
              <!-- Main content -->
                <main class="w-full md:flex-1 p-8">
                    <h1 class="text-4xl text-center font-bold ">{{ $t('plansSection.title')}}</h1>
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
const {t} = useI18n()
const userRole = computed(() => userStore.userData?.role)


const pricingOptions = computed(() => {
  return [
    { label: t('plansSection.PromoSubscription'), path: '/pricing/promotions', roles: ['all'] },
    { label: t('plansSection.eventPayments'), path: '/pricing/events', roles: ['all'] }

  ]
})

useHead({
  title: 'FAQ'
})

</script>
