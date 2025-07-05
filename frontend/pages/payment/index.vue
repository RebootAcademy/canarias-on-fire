<template>
  <div class="p-4 sm:p-12 text-sm">
    <div v-if="userStore.selectedUser" class="text-center mb-4">
      <h2 class="text-3xl font-bold text-primary">{{ $t('paymentsOption.manageSub')}} {{ userStore.selectedUser.companyName || userStore.selectedUser.username }}</h2>
      <p class="mt-2 text-lg font-medium text-gray-300">
        {{ $t('paymentsOption.currentPlan')}} {{ getCurrentPlanName.toUpperCase() }}
      </p>
    </div>
    <div v-else class="text-center sm:mb-4">
      <h2 class="text-2xl font-bold text-primary">{{ $t('paymentsOption.choose')}}</h2>
      <p class="mt-2 text-md text-gray-500">
        {{ $t('paymentsOption.findPerfect')}}
      </p>
    </div>
    <PaymentOptions 
      :payments="paymentStore.payments"
      :stripePayment="true"
      @planSelected="handlePlanSelection"
    />
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'

const route = useRoute()
const userStore = useUserStore()
const paymentStore = usePaymentStore()
const subscriptionStore = useSubscriptionStore()
const eventStore = useEventStore()

const { user, isAuthenticated } = useAuth0()

onMounted(async () => {

  const eventId = route.query.id
  if (eventId) {
    await eventStore.fetchEventById(eventId)
  }

  // If user is authenticated via Auth0, ensure userStore.userData is populated
  if (isAuthenticated.value && user.value?.email) {
    await userStore.fetchAndSetUser(user.value.email)
  }

  // The userId for payment processing should come from userStore.userData
  // If userStore.userData is still null, it means the user is not logged in or data is not fetched.
  // In this case, the payment process for basic plan will fail, which is expected.
  // For paid plans, Stripe will handle authentication.

  await subscriptionStore.fetchSubscriptions()

})

const getCurrentPlanName = computed(() => {
  if (!userStore.selectedUser || !userStore.selectedUser.activeSubscription || !userStore.selectedUser.activeSubscription.plan) {
    return 'No plan'
  }
  const subscription = subscriptionStore.subscriptions.find(
    sub => sub._id === userStore.selectedUser.activeSubscription.plan
  )
  return subscription ? subscription.name : 'Unknown plan'
})

const handlePlanSelection = async (plan) => {
  if (userStore.selectedUser) {
    try {
      const result = await userStore.updateUserSubscription(userStore.selectedUser._id, plan._id)
      if (result.success) {
        userStore.selectedUser = result.user
        alert('Subscription updated successfully')
      } else {
        alert(result.error || 'Failed to update subscription')
      }
    } catch (error) {
      console.error('Error updating subscription:', error)
      alert('An error occurred while updating the subscription')
    }
  } else {
    subscriptionStore.setSelectedPlan(plan)
    // router.push('/register')
  }
}
</script>