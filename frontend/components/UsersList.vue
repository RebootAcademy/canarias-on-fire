<template>
  <div>
    <div class="flex items-center justify-between w-full mb-6">
      <Tabs v-model="activeTab" class="w-auto">
        <TabsList>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="basicUsers">Basic Users</TabsTrigger>
        </TabsList>
      </Tabs>
      <div class="flex gap-4">
        <SearchInput v-model="searchQuery" placeholder="Search users..." />
        <Button @click="openAddUserModal" class="text-sm px-3">
          Add user
        </Button>
      </div>
    </div>
    <UserTable 
      :users="filteredUsers"
      :isCompanyTab="activeTab === 'companies'"
      @userSelected="$emit('userSelected', $event)"
    />
    <AddUserModal :isOpen="isAddUserModalOpen" @close="closeAddUserModal" @userAdded="handleUserAdded" />
  </div>
</template>

<script setup>
const userStore = useUserStore()
const activeTab = ref('companies')
const searchQuery = ref('')
const isAddUserModalOpen = ref(false)

onMounted(() => {
  userStore.fetchUsers()
})

const filteredUsers = computed(() => {
  return userStore.users.filter(user => {
    if (!user || typeof user !== 'object') return false
    
    const matchesTab = activeTab.value === 'companies' 
      ? user.role === 'company' 
      : user.role && user.role !== 'company'
    
    const matchesSearch = (user.username && user.username.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
                          (user.email && user.email.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    return matchesTab && matchesSearch
  })
})

const openAddUserModal = () => {
  isAddUserModalOpen.value = true
}

const closeAddUserModal = () => {
  isAddUserModalOpen.value = false
}

const handleUserAdded = async (userData) => {
  try {
    await userStore.addUser(userData)
    closeAddUserModal()
    await userStore.fetchUsers()
  } catch (error) {
    console.error('Error adding user:', error)
  }
}

defineEmits(['userSelected'])
</script>