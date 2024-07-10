<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Avatar>
        <AvatarImage :src="user?.picture" alt="User Avatar" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @click="navigateTo('/dashboard')">
        {{ $t('dashboard') }}
      </DropdownMenuItem>
<!--       <DropdownMenuItem v-if="!auth0?.isAuthenticated" @click="login">
        {{ $t('login') }}
      </DropdownMenuItem> -->
      <DropdownMenuItem v-if="auth0?.isAuthenticated" @click="handleLogout">
        {{ $t('logout') }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useRouter } from 'vue-router'

const { user, isAuthenticated } = useAuth0()
const router = useRouter()

const auth0 = ref(null)

onMounted(() => {
  auth0.value = useAuth0()
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