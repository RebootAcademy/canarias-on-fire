<template>
  <div>
    <div class="flex justify-between items-start mb-6 mt-6">
      <div>
        <h2 class="text-lg font-semibold">My subscription</h2>
        <p class="text-sm opacity-60">Change your plan based on your needs</p>
        <div v-if="userSubscription" class="bg-gray-500 p-4 rounded-lg mt-6">
          <h3 class="text-lg font-semibold">{{ userSubscription.name.toUpperCase() }}</h3>
          <p>
            {{ userSubscription.pricing }} € 
            ({{ userSubscription.status === 'canceling' ? 'Ending at' : 'Next Renew' }}
            {{ userSubscription.nextRenew }})
          </p>
        </div>
        <div v-else class="bg-gray-500 p-4 rounded-lg mt-6">
          <p>No active subscription</p>
        </div>
        <div class="flex gap-4 mt-4">
          <Button @click="managePlans">Manage Plans</Button>
          <Button @click="toggleSubscription" variant="destructive">{{
            subscriptionButtonText
          }}</Button>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-lg font-semibold">Payment history</h2>
      <p class="text-sm opacity-60 mb-6">
        See history of your payment plan invoice
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Payment date</TableHead>
            <TableHead>Invoice pdf</TableHead>
            <TableHead>Status</TableHead>
            <TableHead class="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="invoice in paymentHistory" :key="invoice.id">
            <TableCell>{{ invoice.id }}</TableCell>
            <TableCell>{{ invoice.paymentDate }}</TableCell>
            <TableCell>
              <NuxtLink
                :to="invoice.pdf"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary hover:underline"
              >
                See PDF
              </NuxtLink>
            </TableCell>
            <TableCell>{{ invoice.status }}</TableCell>
            <TableCell class="text-right">{{ invoice.amount }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const userStore = useUserStore()
const subscriptionStore = useSubscriptionStore()

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const currentUser = computed(() =>
  userStore.users.find((u) => u._id === props.user._id)
)

const userSubscription = computed(() => {
  const activeSubscription = currentUser.value?.activeSubscription
  if (!activeSubscription) return null

  const subscription = subscriptionStore.subscriptions.find(
    (s) => s._id === activeSubscription.plan
  )
  if (!subscription) return null

  return {
    name: subscription.name,
    pricing: subscription.pricing,
    nextRenew: activeSubscription.currentPeriodEnd
      ? new Date(activeSubscription.currentPeriodEnd).toLocaleDateString()
      : 'N/A',
    status: activeSubscription.status,
  }
})

const paymentHistory = computed(() => {
  return currentUser.value?.invoices
    ? currentUser.value.invoices.map((invoice) => ({
        id: invoice.id,
        pdf: invoice.pdf,
        paymentDate: formatDate(invoice.date),
        amount: `$${(invoice.amount / 100).toFixed(2)}`,
        status: userSubscription.value ? userSubscription.value.status : 'N/A',
      }))
    : []
})

const managePlans = () => {
  if (props.user && props.user._id) {
    router.push({
      path: '/pricing',
      query: { userId: props.user._id },
    })
  } else {
    console.error('No user data available for managing plans')
  }
}

const toggleSubscription = async () => {
  if (props.user && props.user._id) {
    let result
    if (userSubscription.value && userSubscription.value.status === 'active') {
      result = await subscriptionStore.cancelSubscription(props.user._id)
      if (result.success) {
        // Actualizar el estado del usuario en el store
        await userStore.updateUserSubscriptionStatus(
          props.user._id,
          'canceling'
        )
        console.log('Subscription canceled successfully')
      } else {
        console.log(result.message || 'Failed to cancel subscription')
      }
    } else {
      result = await subscriptionStore.reactivateSubscription(props.user._id)
      if (result.success) {
        // Actualizar el estado del usuario en el store
        await userStore.updateUserSubscriptionStatus(props.user._id, 'active')
        console.log('Subscription reactivated successfully')
      } else {
        console.log(result.message || 'Failed to reactivate subscription')
      }
    }
  } else {
    console.error('No user data available for toggling subscription')
  }
}

const subscriptionButtonText = computed(() => {
  return userSubscription.value && userSubscription.value.status === 'active'
    ? 'Cancel Plan'
    : 'Reactivate Plan'
})

// NOT WORKING
/* watch(() => userSubscription.value?.status, (newStatus) => {
  console.log('Subscription status changed:', newStatus)
  // This will trigger when the subscription status changes
  subscriptionButtonText.value = newStatus === 'active' ? 'Cancel Plan' : 'Reactivate Plan'
  // Optionally, you can also refresh the payment history here if needed
}, { immediate: true }) */

onMounted(() => {
  if (props.user?._id) {
    userStore.fetchUsers()
  }
  subscriptionStore.fetchSubscriptions()
})

</script>
