<template>
 <div class="flex flex-col items-center bg-background">
    <Hero />
    <div class="w-full md:w-3/4 lg:w-2/3">
       <div class="flex flex-col items-center justify-between w-full px-4 mb-4">
        <div class="flex w-full align-start">
          <h2 class="text-3xl font-semibold text-primary text-left">{{ $t('dashboardNav.plannedYourEvents') }}</h2>
        </div>
       <div class="mt-4">
         <CategoriesPlanYourParty />
         <PlanYourParty />
       </div>
       </div>

    </div>

 </div>
</template>

<script setup>
const { t } = useI18n()



</script>
