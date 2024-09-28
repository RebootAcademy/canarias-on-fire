<template>
  <div v-if="userStore.userData.role === 'company'" class="flex flex-col gap-4">
    <div
      v-if="userStore.userData.activeSubscription"
      class="flex flex-col gap-4 w-full lg:w-1/2"
    >
      <h1 class="text-xl font-semibold">{{ $t('paymentsSection.mySubscription')}}</h1>
      <p class="text-grayForeground">{{ $t('paymentsSection.SubDescription')}}</p>
      <div class="bg-primary-gradient p-0.5 rounded-md">
        <div class="bg-background p-4 px-6 rounded-md">
            <div class="flex gap-4 bg-gradient-to-r from-[#FBB03B] via-[#F7931E] to-[#ED1C24] text-transparent bg-clip-text">
                <Gem class="text-primary"/>
                <p class="font-bold ">{{ subscriptionInformation.name }}</p>
            </div>
          <div class="flex flex-row gap-4 mt-4">
            <p class="font-bold">{{ subscriptionInformation.pricing }} €</p>
            <p
              v-if="userStore.userData?.activeSubscription?.status === 'active'"
              class="text-grayForeground"
            >
              ({{ $t('paymentsSection.renuewDate') }} {{ nextPaymentDate }} )
            </p>
            <p
              v-if="
                userStore.userData?.activeSubscription?.status === 'canceled'
              "
            >
              ( {{ $t('paymentsSection.cancelAt') }}
              {{
                new Date(
                  userStore.userData?.activeSubscription?.canceledAt
                ).toLocaleDateString()
              }}
              )
            </p>
          </div>
        </div>
      </div>
      <div class="w-1/2 lg:w-1/4">
        <Button
          key="manage"
          variant="ghost"
          @click="
            () => 
              router.replace('/pricing')
          "
          class="w-full bg-gray hover:bg-primary-gradient"
          >{{$t('buttons.manage')}}</Button
        >
      </div>
    </div>
    <div v-else class="w-full lg:w-1/2">
      <h1 class="text-xl font-semibold">{{ $t('paymentsSection.mySubscription') }}</h1>
      <p class="text-grayForeground">{{ $t('paymentsSection.noSubscription')}}</p>
        <Button
          key="subscribe"
          variant="ghost"
          @click="
            () => 
              router.replace('/pricing')
          "
          class="w-full bg-gray hover:bg-primary-gradient"
          >{{$t('buttons.subscribe')}}</Button
        >
    </div>
  </div>
  <div class="mt-8">
    <p class="text-xl font-semibold">{{ $t('paymentsSection.paymentHistory') }}</p>
    <p class="text-grayForeground mt-4">{{ $t('paymentsSection.paymentDetails') }}</p>
    <div v-idivf="formattedInvoices.length" class="container mx-auto p-4">
      <table class="table-auto w-full">
        <thead>
          <tr class="text-grayForeground border-b-2 border-gray">
            <th class="text-start p-2">{{ $t('paymentsSection.paymentDate') }}</th>
            <th class="text-start p-2">{{ $t('paymentsSection.paymentAmount') }}</th>
            <th class="text-start p-2">{{ $t('paymentsSection.paymentInvoice') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(invoice, index) in formattedInvoices"
            :key="index"
            class="p-2 border-b border-gray"
          >
            <td class="p-2">
              {{ invoice.formattedDate }}
            </td>
            <td class="p-2">
              {{ invoice.formattedAmount }} €
            </td>
            <td class="p-2">
              <a
                :href="invoice.pdf"
                class="text-blue-600 underline"
                target="_blank"
                >{{ $t('buttons.download') }} {{ $t('paymentsSection.paymentInvoice') }}</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="!formattedInvoices">{{ $t('paymentsSection.noInvoices') }}</p>
  </div>
</template>

<script setup>
const { t } = useI18n()
import { Gem } from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()
const subscriptionStore = useSubscriptionStore()

const subscriptionInformation = computed(() => {
  return subscriptionStore.subscriptions.find(
    (sub) => sub._id === userStore.userData?.activeSubscription?.plan
  )
})

const nextPaymentDate = computed(() => {
  if (!userStore.userData?.activeSubscription) {
    return null
  }
  return new Date(
    userStore.userData?.activeSubscription?.currentPeriodEnd
  ).toLocaleDateString()
})

const formattedInvoices = computed(() => {
  if (!userStore.userData?.invoices.length) {
    return null
  }

  return userStore.userData?.invoices.map((invoice) => {
    const formattedDate = new Date(invoice.date).toLocaleDateString()
    const formattedAmount = (invoice.amount / 100).toFixed(2) // Convertir 1999 a 19.99€
    return {
      ...invoice,
      formattedDate,
      formattedAmount,
    }
  })
})

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Payments',
})
</script>
