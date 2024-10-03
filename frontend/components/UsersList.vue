<template>
  <div>
    <div class="flex flex-col-reverse gap-4 md:flex-row items-center justify-between w-full mb-6">
      <Tabs v-model="activeTab" class="w-auto">
        <TabsList >
          <TabsTrigger value="companies">
            <span 
            :class="activeTab === 'companies' ? 'text-primary' : 'text-white'"
            >{{ $t('userCompanies') }}</span>
          </TabsTrigger>
          <TabsTrigger v-if="isThereNotValidatedCompany.length" value="validateCompanies"  class="relative">
            <div  class="absolute top-0 right-0 rounded-full  bg-red-500 w-2 h-2 animate-pulse "/>
            <span :class="activeTab === 'validateCompanies' ? 'text-primary' : 'text-white'">
              {{ $t('notValidatedCompanies') }}
            </span>
          </TabsTrigger>
          <TabsTrigger value="basicUsers">
            <span :class="activeTab === 'basicUsers' ? 'text-primary' : 'text-white'">
              {{ $t('basicUsers') }}
            </span>
          </TabsTrigger>
          
        </TabsList>
      </Tabs>
      <div class="flex flex-col-reverse md:flex-row gap-4 items-center">
        <SearchInput v-model="searchQuery" :placeholder="$t('search')" />
        <CustomBtn
          :title="$t('addUser')"
          @click="openAddUserModal"
        /> 
      </div>
    </div>
    <UserTable 
      :users="filteredUsers"
      :isCompanyTab="activeTab === 'companies'"
      :isValidateCompanyTab="activeTab === 'validateCompanies'"
      :companiesNotValidated="isThereNotValidatedCompany"
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
    
    const matchesTab = activeTab.value === 'companies' || activeTab.value === 'validateCompanies'
      ? user?.role === 'company' 
      : user?.role && user?.role !== 'company'
    
    const matchesSearch = (user.username && user.username.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
                          (user.email && user.email.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    return matchesTab && matchesSearch
  })
})

const isThereNotValidatedCompany = computed(() => {
  return userStore.users.filter(user => {
    return user?.role === 'company' && !user.isValidated
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