<template>
  <div class="p-4 text-sm">
    <div class="text-center mt-4">
      <h2 class="text-lg md:text-xl lg:text-2xl font-semibold">
        {{ $t('paymentsOption.payForEvent') }}
      </h2>
      <p class="mt-2 text-md md:text-lg lg:text-xl">
        {{ $t('paymentsOption.payForEventDescription') }}
      </p>
    </div>
    <PaymentOptions :payments="paymentStore.payments"/>
  </div>
</template>

<script setup>
const userStore = useUserStore()
const paymentStore = usePaymentStore()

definePageMeta({
  layout: 'pricing-layout',
})

</script>