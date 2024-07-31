<template>
  <div class="p-4">
    <h2 class="text-2xl font-semibold mb-6">Users Management</h2>
    <UsersList 
      v-if="!selectedUser"
      @userSelected="selectUser"
    />
    <template v-else-if="selectedUser">
      <UserProfile 
        :user="selectedUser" 
        @back="selectedUser = null"
        @tabChange="setActiveTab"
      />
      <UserEvents 
        v-if="selectedUser.role === 'company' && activeTab === 'events'"
        :user="selectedUser"
      />
      <UserSubscriptions 
        v-if="selectedUser.role === 'company' && activeTab === 'subscriptions'"
        :user="selectedUser"
      />
    </template>
  </div>
</template>

<script setup>
const userStore = useUserStore()
const selectedUser = ref(null)
const activeTab = ref('profile')

onMounted(() => {
  userStore.fetchUsers()
})

const selectUser = (user) => {
  selectedUser.value = user
  activeTab.value = 'profile'
}

const setActiveTab = (tab) => {
  activeTab.value = tab
}

</script>