<template>
<div class="flex flex-col min-h-screen bg-background text-secondary">
    <NavBar />
    <main class="flex-grow w-full">
        <div class="flex flex-col min-h-screen md:px-8 py-12">

            <div class="flex items-center flex-col lg:flex-row lg:items-start ">      
              <!-- Sidebar -->
                <CustomSidebar :links="helpOptions" :userRole="userRole" />
          
              <!-- Main content -->
                <main class="w-full px-4  md:ml-8 md:flex-1 sm:p-8">
                    <h1 class="text-primary text-2xl lg:text-[38px] text-center font-bold mb-6">{{ $t('helpTitle')}}</h1>
                    <NuxtPage />
                </main>
            </div>
          </div>
    </main>
    <Footer />
    <ScrollButton/>
</div>
</template>

<script setup>
const userStore = useUserStore()
const {t} = useI18n()
const userRole = computed(() => userStore.userData?.role)


const helpOptions = computed(() => {
  return [
    { label: t('sideBarHelp.general'), path: '/help/general', roles: ['all'] },
    { label: t('sideBarHelp.subscriptions'), path: '/help/subscriptions', roles: ['all'] },
    { label: t('sideBarHelp.payments'), path: '/help/payments', roles: ['all'] },
    { label: t('sideBarHelp.technical'), path: '/help/technical', roles: ['all'] },
    { label: t('sideBarHelp.account'), path: '/help/account', roles: ['all'] }
  ]
})

useHead({
  title: 'FAQ'
})

</script>
