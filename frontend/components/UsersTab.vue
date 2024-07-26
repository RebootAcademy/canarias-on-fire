<template>
  <div class="p-4">
    <h2 class="text-2xl font-semibold mb-6">Users Management</h2>
    <UsersList 
      v-if="!selectedUser"
      @userSelected="selectUser"
    />
    <UserProfile 
      v-else 
      :user="selectedUser" 
      @back="selectedUser = null"
    />
  </div>
</template>

<script setup>
const userStore = useUserStore()
const selectedUser = ref(null)

onMounted(() => {
  userStore.fetchUsers()
})

const selectUser = (user) => {
  selectedUser.value = user
}

</script>