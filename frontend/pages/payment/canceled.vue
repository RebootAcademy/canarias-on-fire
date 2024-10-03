<template>
  <div class="flex h-screen flex-col gap-8 items-center justify-center ">
    <h1 class="text-3xl ">{{  $t('canceledView.paymentTitle') }}</h1>
    <div class="flex gap-4">
      <NuxtLink to="/">
        <div class="bg-primary-gradient p-0.5 font-bold rounded-md hover:opacity-90">
          <div class="bg-background p-4 px-6 rounded-md hover:bg-gray">
            {{ $t('buttons.backHome') }}
          </div>
        </div>
      </NuxtLink>
      <NuxtLink to="/pricing">
        <div class="bg-primary-gradient p-0.5 font-bold rounded-md hover:opacity-90">
          <div class="bg-primary-gradient p-4 px-6 font-bold rounded-md hover:opacity-90">
            {{ $t('buttons.pricing') }}
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>