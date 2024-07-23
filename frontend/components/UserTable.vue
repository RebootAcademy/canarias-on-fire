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
        <TableCell class="text-right">{{ isCompanyTab ? getSubscriptionName(user.subscription) : user.role }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script setup>

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

const getSubscriptionName = (subscription) => {
  // Aquí puedes implementar la lógica para obtener el nombre de la suscripción
  // Por ahora, simplemente devolveremos el ID de la suscripción o "N/A" si no existe
  return subscription ? subscription.toString() : 'N/A'
}
</script>