<template>
  <div v-if="userData?.role === 'company'" class="flex flex-col gap-4">
    <div
      v-if="userData?.activeSubscription?.status !== 'inactive'"
      class="flex flex-col gap-4 w-full lg:w-1/isAuthenticated2"
    >
      <h1 class="text-xl font-semibold">{{ $t('paymentsSection.mySubscription')}}</h1>
      <p class="text-grayForeground">{{ $t('paymentsSection.SubDescription')}}</p>
      <div class="bg-primary-gradient p-0.5 rounded-md">
        <div class="bg-background p-4 px-6 rounded-md">
          <div class="w-full justify-between flex items-center">
            <div class="flex gap-4 bg-gradient-to-r from-[#FBB03B] via-[#F7931E] to-[#ED1C24] text-transparent bg-clip-text">
                <Gem class="text-primary"/>
                <p class="font-bold ">{{ subscriptionInformation?.name }}</p>
            </div>
            <Button
              v-if="userData?.activeSubscription?.status === 'active'"
              class="cursor-pointer inline-block w-1/5 bg-grey border-2 border-red-400 text-red-400 font-semibold py-2 px-4 rounded-lg text-center hover:bg-red-500 hover:border-none hover:text-white transition-colors"
              @click="cancelSubscription(userData?.activeSubscription?.plan)"
            >
              {{ $t('buttons.cancel') }}
            </Button>
          </div>
          <div class="flex flex-row gap-4 mt-4">
            <p class="font-bold">{{ subscriptionInformation?.pricing }} €</p>
            <p
              v-if="userData?.activeSubscription?.status === 'active'"
              class="text-grayForeground"
            >
              ({{ $t('paymentsSection.renuewDate') }} {{ nextPaymentDate }} )
            </p>
            <p
              v-if="
                userData?.activeSubscription?.status === 'canceled'
              "
            >
              ( {{ $t('paymentsSection.cancelAt') }}
              {{
                new Date(
                  userData?.activeSubscription?.canceledAt
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
    <div v-if="userData.activeSubscription?.status === 'inactive' && userData.role === 'company'" class=" flex flex-col w-full gap-2 lg:w-1/2">
      <h1 class="text-xl font-semibold">{{ $t('paymentsSection.mySubscription') }}</h1>
      <p class="text-grayForeground">{{ $t('paymentsSection.noSubscription')}}</p>
        <Button
          key="subscribe"
          variant="ghost"
          @click="
            () => 
              router.replace('/pricing')
          "
          class="w-full md:w-1/2 bg-gray hover:bg-primary-gradient"
          >{{$t('buttons.subscribe')}}</Button
        >
    </div>
  </div>
  <PaymentList :formattedInvoices="formattedInvoices" />
</template>

<script setup>
const { t } = useI18n()
import { Gem } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
const router = useRouter()
const userStore = useUserStore()
const subscriptionStore = useSubscriptionStore()
const paymentStore = usePaymentStore()
const userData = computed(() => userStore.userData)
const subscriptionInformation = computed(() => {
  return subscriptionStore.subscriptions?.find(
    (sub) => sub._id === userStore.userData?.activeSubscription?.plan
  ) 
})

const nextPaymentDate = computed(() => {
  if (!userStore.userData?.activeSubscription) return null
  // Verifica si el cliente está en el período de prueba y si su `trialEnd` es mayor que la fecha actual
  if (
    userStore.userData?.activeSubscription?.trialEnd &&
    new Date(userStore.userData?.activeSubscription?.trialEnd) > new Date()
  ) {
    return new Date(userStore.userData.activeSubscription.trialEnd).toLocaleDateString()
  }
  return new Date(userStore.userData.activeSubscription.currentPeriodEnd).toLocaleDateString()
})

const formattedInvoices = computed(() => {
  if (!userStore.userData?.invoices?.length) return []
  return userStore.userData.invoices.map((invoice) => ({
    ...invoice,
    formattedDate: new Date(invoice.date).toLocaleDateString(),
    formattedAmount: (invoice.amount / 100).toFixed(2), // Convertir 1999 a 19.99€
  }))
})

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Payments',
})

const isCanceled = computed(() => {
  if (userStore.userData.activeSubscription?.status === 'canceled') {
    return true
  } else {
    return false
  }
})

const getUserId = () => {
  if (userStore.userData.role === 'admin' && userStore.selectedUser) {
    return userStore.selectedUser._id
  } else {
    return userStore.userData._id
  }
}

const cancelSubscription = async (plan) => {
  try {
    const userId = getUserId()
    const result = await subscriptionStore.cancelSubscription(userId, plan._id)
    if (result.success) {
      await userStore.updateUserSubscription(userId, plan._id, 'canceled')
      toast({
        description: t('canceledPlan')
      })
    } else {
      console.error(result?.error || 'Failed to cancel subscription')
      toast({
        description: t('canceledPlanError'),
        variant: 'destructive'
      })
    }
  } catch (error) {
    console.error('Error canceling subscription:', error)
  }
}
</script>
