<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>{{ $t('userName') }}</TableHead>
        <TableHead>{{ $t('email') }}</TableHead>
        <TableHead class="text-right">{{ isCompanyTab || isValidateCompanyTab ? $t('subscription') : $t('role') }}</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow 
        v-for="user in usersToShow" 
        :key="user._id"
        @click="$emit('userSelected', user)"
        class=" cursor-pointer"
      >
        <TableCell >
          {{ user.username }}
        </TableCell>
        <TableCell>{{ user.email }}</TableCell>
        <TableCell class="text-right">{{ isCompanyTab || isValidateCompanyTab ? getSubscriptionName(user) : user.role }}</TableCell>
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
  isValidateCompanyTab: {
    type: Boolean,
    default: false
  },
  companiesNotValidated: {
    type: Boolean,
  }
})
const isNotValidatedThisUser = (user) => {
  if (!props.isCompanyTab && props.companiesNotValidated.length > 0 ){
    return props.companiesNotValidated.find((company) => company._id === user)
  }
}

const usersToShow = computed(() => {
  if (props.isValidateCompanyTab) {
    return props.users.filter((user) => !user.isValidated)
  } else {
    return props.users
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