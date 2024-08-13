<template>
  <div class="p-12 text-sm">
    <div v-if="userStore.selectedUser" class="text-center mb-8">
      <h2 class="text-3xl font-bold text-primary">Manage Subscription for {{ userStore.selectedUser.companyName || userStore.selectedUser.username }}</h2>
      <p class="mt-2 text-lg font-medium text-gray-300">
        Current plan: {{ userStore.selectedUser.subscription ? userStore.selectedUser.subscription.name : 'No plan' }}
      </p>
    </div>
    <div v-else class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Choose your plan</h2>
      <p class="mt-2 text-md text-gray-500">
        Find the perfect plan that suits your event needs.
      </p>
    </div>
    <SubscriptionPlans 
      :plans="subscriptionStore.subscriptions"
      :selectedPlan="userStore.selectedUser ? userStore.selectedUser.subscription : null"
      @planSelected="handlePlanSelection"
    />
  </div>
</template>

<script setup>
const route = useRoute()
const userStore = useUserStore()
const subscriptionStore = useSubscriptionStore()

onMounted(async () => {
  const userId = route.query.userId
  if (userId) {
    userStore.selectedUser = userStore.users.find(user => user._id === userId)
  }
  await subscriptionStore.fetchSubscriptions()
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