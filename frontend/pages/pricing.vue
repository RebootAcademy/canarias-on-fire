<template>
  <div class="p-12 text-sm">
    <div v-if="selectedUser" class="text-center mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Manage Subscription for {{ selectedUser.companyName || selectedUser.username }}</h2>
      <p class="mt-2 text-md text-gray-500">
        Current plan: {{ selectedUser.subscription ? selectedUser.subscription.name : 'No plan' }}
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
      :selectedPlan="selectedUser ? selectedUser.subscription : null"
      @planSelected="handlePlanSelection"
    />
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const subscriptionStore = useSubscriptionStore()

const selectedUser = ref(null)

onMounted(async () => {
  const userId = route.query.userId
  if (userId) {
    selectedUser.value = userStore.users.find(user => user._id === userId)
  }
  await subscriptionStore.fetchSubscriptions()
})

const handlePlanSelection = async (plan) => {
  if (selectedUser.value) {
    try {
      const result = await userStore.updateUserSubscription(selectedUser.value._id, plan._id)
      if (result.success) {
        selectedUser.value = result.user
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