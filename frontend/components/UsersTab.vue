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
      @update="updateUser"
      @deactivate="deactivateUser"
      @delete="deleteUser"
      @back="selectedUser = null"
    />
  </div>
</template>

<script setup>
const userStore = useUserStore()
const activeTab = ref('companies')
const searchQuery = ref('')
const selectedUser = ref(null)


onMounted(() => {
  userStore.fetchUsers()
})

const filteredUsers = computed(() => {
  const users = activeTab.value === 'companies' 
    ? userStore.users.filter(user => user.role === 'company')
    : userStore.users.filter(user => user.role === 'basic')
  
  if (!searchQuery.value) return users
  
  const query = searchQuery.value.toLowerCase()
  return users.filter(user => 
    user.username.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query)
  )
})

const selectUser = (user) => {
  selectedUser.value = user
  if (!user) {
    eventStore.clearUserEvents()
  }
}

const updateUser = async (updatedUser) => {
  try {
    const result = await userStore.updateUserProfile(updatedUser)
    if (result.success) {
      const index = userStore.users.findIndex(u => u._id === updatedUser._id)
      if (index !== -1) {
        userStore.users[index] = { ...userStore.users[index], ...updatedUser }
      }
      selectedUser.value = null 
    } else {
      console.error('Failed to update user:', result.message)
    }
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

const deactivateUser = async (userId) => {
  console.log('Deactivating user:', userId)
}

const deleteUser = async (userId) => {
  try {
    const result = await userStore.deleteUser(userId)
    if (result.success) {
      userStore.users = userStore.users.filter(u => u._id !== userId)
      selectedUser.value = null
    } else {
      console.error('Failed to delete user:', result.message)
    }
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}
</script>