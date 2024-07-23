<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Username</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Role</TableHead>
        <TableHead class="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="user in users" :key="user._id">
        <TableCell>{{ user.username }}</TableCell>
        <TableCell>{{ user.email }}</TableCell>
        <TableCell>{{ user.role }}</TableCell>
        <TableCell class="text-right">
<!--           <Button @click="editUser(user)" class="mr-2">Edit</Button>
          <Button @click="deleteUser(user)" variant="destructive">Delete</Button> -->
        </TableCell>
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

const emit = defineEmits(['edit', 'delete'])

const editUser = (user) => {
  emit('edit', user)
}

const deleteUser = (user) => {
  emit('delete', user)
}
</script>