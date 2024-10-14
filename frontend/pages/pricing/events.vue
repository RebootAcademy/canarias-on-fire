<template>
  <div class="p-4 text-sm">
    <div class="text-center mt-4">
      <h2 class="text-2xl font-bold text-gray-900">
        {{ $t('paymentsOption.payForEvent') }}
      </h2>
      <p class="mt-2 text-md text-gray-300">
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