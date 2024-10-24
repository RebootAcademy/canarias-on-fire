<template>
 <div class="flex flex-col items-center bg-background">
    <Hero class="hidden md:flex"/>
    <div class="w-full mt-8 md:mt0 md:w-3/4 lg:w-2/3">
       <div class="flex flex-col items-center justify-between w-full px-4 mb-4">
        <div class="flex w-full align-start">
          <h2 class="text-2xl lg:text-[38px] font-bold text-primary text-left mb-4">{{ $t('dashboardNav.plannedYourEvents') }}</h2>
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
