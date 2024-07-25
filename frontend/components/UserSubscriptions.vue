<template>
  <div>
    <div class="flex justify-between items-start mb-6 mt-6">
      <div>
        <h2 class="text-lg font-semibold">My subscription</h2>
        <p class="text-sm opacity-60">Change your plan based on your needs</p>
        <div class="bg-gray-100 p-4 rounded-lg mt-6">
          <h3 class="text-lg font-semibold">{{ subscription.plan }}</h3>
          <p>{{ subscription.price }}€ (next renew {{ subscription.nextRenew }})</p>
        </div>
        <div class="flex gap-4 mt-4">
          <Button @click="explorePlans">Explore Plans</Button>
          <Button @click="managePlans" variant="outline">Manage Plans</Button>
        </div>
      </div>

      <div>
        <h2 class="text-lg font-semibold">Payment method</h2>
        <p class="text-sm opacity-60">Change how you pay your subscription</p>
        <div class="bg-gray-100 p-4 rounded-lg mt-6 flex items-center">
          <img :src="paymentMethod.image" alt="Payment Method" class="w-12 h-12 mr-4" />
          <div>
            <p>{{ paymentMethod.name }}</p>
            <p>{{ paymentMethod.type }} .... {{ paymentMethod.last4 }}</p>
          </div>
          <div class="ml-auto">
            <Button @click="deletePaymentMethod" variant="outline">Delete</Button>
            <Button @click="changePaymentMethod" class="ml-2">Change</Button>
          </div>
        </div>
        <p class="text-xs mt-2">Notes: Please be careful on choosing your payment method, because we will automatically cut your balance</p>
      </div>
    </div>

    <div>
      <h2 class="text-lg font-semibold">Payment history</h2>
      <p class="text-sm opacity-60 mb-6">See history of your payment plan invoice</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead class="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="invoice in paymentHistory" :key="invoice.id">
            <TableCell>{{ invoice.name }}</TableCell>
            <TableCell>{{ invoice.status }}</TableCell>
            <TableCell>{{ invoice.method }}</TableCell>
            <TableCell class="text-right">{{ invoice.amount }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup>
const userStore = useUserStore()

const subscription = ref({
  plan: 'Premium',
  price: '30,99',
  nextRenew: '01 July 2024'
})

const paymentMethod = ref({
  name: 'Pepechuga de Jesús Ramírez Alonso',
  type: 'Débito',
  last4: '9856',
  image: 'path/to/visa/image.png'
})

const paymentHistory = ref([
  { id: 'INV001', name: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
  { id: 'INV002', name: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
  { id: 'INV003', name: 'INV003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
  { id: 'INV004', name: 'INV004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
  { id: 'INV005', name: 'INV005', status: 'Paid', method: 'PayPal', amount: '$550.00' },
  { id: 'INV006', name: 'INV006', status: 'Pending', method: 'Bank Transfer', amount: '$200.00' }
])

const explorePlans = () => {
  // Logic to explore plans
}

const managePlans = () => {
  // Logic to manage plans
}

const deletePaymentMethod = () => {
  // Logic to delete payment method
}

const changePaymentMethod = () => {
  // Logic to change payment method
}

onMounted(() => {
  // Fetch subscription, payment method, and payment history from the store or API
})
</script>