<template>
  <div>
    <Profile v-if="userRole === 'basic'" />
    <AdminDashboard v-if="userRole === 'admin'" />
    <CompanyDashboard v-if="userRole === 'company'" />
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Dashboard'
})

const userStore = useUserStore()
const userRole = computed(() => userStore.userData?.role)

onMounted(() => {
  userStore.fetchUsers()
})

</script>