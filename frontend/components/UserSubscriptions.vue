<template>
  <div>
    <div class="flex justify-between items-start mb-6 mt-6">
      <div>
        <h2 class="text-lg font-semibold">My subscription</h2>
        <p class="text-sm opacity-60">Change your plan based on your needs</p>
        <div v-if="userSubscription" class="bg-gray-500 p-4 rounded-lg mt-6">
          <h3 class="text-lg font-semibold">{{ userSubscription.name }}</h3>
          <p>{{ userSubscription.pricing }} € (Next Renew {{ userSubscription.nextRenew }})</p>
        </div>
        <div v-else class="bg-gray-500 p-4 rounded-lg mt-6">
          <p>No active subscription</p>
        </div>
        <div class="flex gap-4 mt-4">
          <Button @click="managePlans">Manage Plans</Button>
        </div>
      </div>
    </div>

    <div>
      <h2 class="text-lg font-semibold">Payment history</h2>
      <p class="text-sm opacity-60 mb-6">See history of your payment plan invoice</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Payment date</TableHead>
            <TableHead>Invoice pdf</TableHead>
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
    required: true
  }
})

const router = useRouter()
const userStore = useUserStore()
const subscriptionStore = useSubscriptionStore()

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const currentUser = computed(() => 
  userStore.users.find(u => u._id === props.user._id)
)

const userSubscription = computed(() => {
  const activeSubscription = currentUser.value?.activeSubscription
  if (!activeSubscription) return null

  const subscription = subscriptionStore.subscriptions.find(s => s._id === activeSubscription.plan)
  if (!subscription) return null

  return {
    name: subscription.name,
    pricing: subscription.pricing,
    nextRenew: activeSubscription.currentPeriodEnd ? new Date(activeSubscription.currentPeriodEnd).toLocaleDateString() : 'N/A'
  }
})

const paymentHistory = computed(() => 
  currentUser.value?.invoices
    ? currentUser.value.invoices.map(invoice => ({
        id: invoice.id,
        pdf: invoice.pdf,
        paymentDate: formatDate(invoice.date),
        amount: `$${(invoice.amount / 100).toFixed(2)}`
      }))
    : []
)

const managePlans = () => {
  if (props.user && props.user._id) {
    router.push({
      path: '/pricing',
      query: { userId: props.user._id }
    })
  } else {
    console.error('No user data available for managing plans')
  }
}

onMounted(() => {
  if (props.user?._id) {
    userStore.fetchUsers() // Asumiendo que este método existe y obtiene todos los usuarios
  }
  subscriptionStore.fetchSubscriptions()
})
</script>