<template>
  <DropdownMenu >
    <DropdownMenuTrigger as-child>
      <Avatar :class="[theme !== 'dark' ? 'ring-1 ring-black rounded-full' : '']">
        <AvatarImage  :src="userProfileImage" alt="User Avatar" />
        <AvatarFallback>{{ userInitials }}</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="bg-background text-secondary ">
      <DropdownMenuItem @click="navigateTo()" class="cursor-pointer hover:bg-foreground-muted hover:text-primary">
        {{ $t('dashboard') }}
      </DropdownMenuItem>
      <DropdownMenuItem v-if="userStore.isAuthenticated" @click="handleLogout" class="cursor-pointer hover:bg-foreground-muted hover:text-primary">
        {{ $t('logout') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'

const userStore = useUserStore()
const router = useRouter()
// const { user } = useAuth0()
const userRole = computed(() => userStore.userData?.role)
const auth0 = ref(null)
const user = userStore?.userData
onMounted(() => {
  auth0.value = useAuth0()
})

const userProfileImage = computed(() => {
  return userStore.userData?.profileImg || user?.value?.picture || '/usuario.png'
})

const theme = computed(() => userStore.themePreference)


const userInitials = computed(() => {
  const name = userStore.userData?.username || user?.value?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const handleLogout = () => {
  if (auth0?.value) {
    auth0?.value?.logout({ logoutParams: {
      returnTo: window.location.origin
    }})
    userStore.clearUserData()
  }
}

const navigateTo = () => {
  switch (userRole?.value) {
    case 'admin':
    case 'company':
      return router.push('/dashboard/events')
    case 'musician':
      return router.push('/dashboard/profile')
    default:
      return router.push('/')

  }
}
</script>

<style scope>
[data-radix-popper-content-wrapper] {
  transform: auto !important; 

} 
</style>