<template>
<div class="flex flex-col min-h-screen bg-black">
    <NavBar />
    <main class="flex-grow w-full">
        <div class="flex flex-col min-h-screen px-8 py-12">

            <div class="flex items-center flex-col lg:flex-row lg:items-start ">      
              <!-- Sidebar -->
                <CustomSidebar :links="helpOptions" :userRole="userRole" />
          
              <!-- Main content -->
                <main class="w-full md:flex-1 p-8">
                    <h1 class="text-4xl text-center font-bold mb-6">{{ $t('helpTitle')}}</h1>
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
