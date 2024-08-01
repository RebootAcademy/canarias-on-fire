<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Avatar>
        <AvatarImage :src="userProfileImage" alt="User Avatar" />
        <AvatarFallback>{{ userInitials }}</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @click="navigateTo('/dashboard')">
        {{ $t('dashboard') }}
      </DropdownMenuItem>
      <DropdownMenuItem v-if="auth0?.isAuthenticated" @click="handleLogout">
        {{ $t('logout') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'

const userStore = useUserStore()
const router = useRouter()
const { user } = useAuth0()

const auth0 = ref(null)

onMounted(() => {
  auth0.value = useAuth0()
})

const userProfileImage = computed(() => {
  return userStore.userData?.profileImg || user.value?.picture
})

const userInitials = computed(() => {
  const name = userStore.userData?.username || user.value?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const handleLogout = () => {
  if (auth0.value) {
    auth0.value.logout({ logoutParams: {
      returnTo: window.location.origin
    }})
  }
}

const navigateTo = (path) => {
  router.push(path)
}
</script>