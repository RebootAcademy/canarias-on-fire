<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Username</TableHead>
        <TableHead>Email</TableHead>
        <TableHead class="text-right">Role</TableHead>
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
        <TableCell class="text-right">{{ user.role }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>

<script setup>

const props = defineProps({
  users: {
    type: Array,
    required: true
  }
})
</script>