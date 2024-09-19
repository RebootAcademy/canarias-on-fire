<template>
  <div class="p-4">
    <h2 class="text-2xl font-semibold mb-6">{{ $t('userManagement')}}</h2>
    <UsersList 
      v-if="!selectedUser"
      @userSelected="selectUser"
    />
    <template v-else-if="selectedUser">
      <UserProfile 
        :user="selectedUser" 
        @back="clearSelectedUser"
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
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const selectedUser = ref(null)
const activeTab = ref('profile')
const route = useRoute()

onMounted(() => {
  userStore.fetchUsers()
})

const selectUser = (user) => {
  selectedUser.value = user
  userStore.selectedUser = user // Actualizar el store con el usuario seleccionado
  activeTab.value = 'profile'
}

const clearSelectedUser = () => {
  selectedUser.value = null
  userStore.selectedUser = null // Limpiar el usuario seleccionado en el store
}

const setActiveTab = (tab) => {
  activeTab.value = tab
}

// Watch for route changes to clear selectedUser
watch(route, () => {
  if (route.name !== 'UsersTab') {
    clearSelectedUser()
  }
})
</script>