<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>{{ $t('userName') }}</TableHead>
        <TableHead>{{ $t('email') }}</TableHead>
        <TableHead class="text-right">{{ isCompanyTab ? $t('subscription') : $t('role') }}</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow 
        v-for="user in users" 
        :key="user._id"
        @click="$emit('userSelected', user)"
        class=" cursor-pointer"
      >
        <TableCell class="relative">
          {{ user.username }}
          <div v-if="isNotValidatedThisUser(user._id)" class="absolute top-2 left-0 rounded-full  bg-red-500 w-2 h-2  "/>
        </TableCell>
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
  },
  companiesNotValidated: {
    type: Array,
  }
})
const isNotValidatedThisUser = (user) => {
  if (props.isCompanyTab && props.companiesNotValidated.length > 0 ){
    return props.companiesNotValidated.find((company) => String(company._id) === user)
  }
}

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