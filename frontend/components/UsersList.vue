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
  </div>
</template>

<script setup>
const userStore = useUserStore()
const activeTab = ref('companies')
const searchQuery = ref('')

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

const openAddUserModal = () => {
  // Implementation
}

defineEmits(['userSelected'])
</script>