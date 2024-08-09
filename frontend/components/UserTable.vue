<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Username</TableHead>
        <TableHead>Email</TableHead>
        <TableHead class="text-right">{{ isCompanyTab ? 'Subscription' : 'Role' }}</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow 
        v-for="user in users" 
        :key="user._id"
        @click="$emit('userSelected', user)"
        class="cursor-pointer"
      >
        <TableCell>{{ user.username }}</TableCell>
        <TableCell>{{ user.email }}</TableCell>
        <TableCell class="text-right">{{ isCompanyTab ? getSubscriptionName(user) : user.role }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script setup>
const subscriptionStore = useSubscriptionStore()

const props = defineProps({
  users: {
    type: Array,
    required: true
  },
  isCompanyTab: {
    type: Boolean,
    default: false
  }
})

const getSubscriptionName = (user) => {
  if (!user || !user.activeSubscription || !user.activeSubscription.plan) {
    return 'N/A'
  }
  const subscription = subscriptionStore.subscriptions.find(
    sub => sub._id === user.activeSubscription.plan
  )
  return subscription ? subscription.name : 'Unknown'
}

</script>