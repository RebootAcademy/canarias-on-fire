<template>
  <div class="h-16 bg-blue-400 flex items-end justify-between px-4 py-2">
    <div class="text-2xl font-extrabold text-white">
      <NuxtLink to="/">
        Canarias<span class="text-sm text-black">onFire</span>
      </NuxtLink>
    </div>
    <div class="text-sm font-bold flex gap-2">
      <NuxtLink to="/event">
        <Button>
          <span class="mr-2 text-lg">+</span>Create Event
        </Button>
      </NuxtLink>
      <button 
        @click="login"
        class="hover:underline"
      >
        Log in
      </button>
      <button 
        @click="handleLogout"
        class="hover:underline"
      >
        Log out
      </button>
      <NuxtLink to="/dashboard">
        <Avatar v-if="isAuthenticated">
          <AvatarImage :src="user.picture" alt="@radix-vue" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const login = () => {
  loginWithRedirect({ appState: { target: '/dashboard' }})
}

let loginWithRedirect
let logout
let user
let isAuthenticated

onMounted(async () => {
  const auth0 = useAuth0()
  isAuthenticated = auth0.isAuthenticated
  user = auth0.user
  loginWithRedirect = auth0.loginWithRedirect
  logout = auth0.logout
})

const handleLogout = () => {
  logout({ logoutParams: {
    returnTo: window.location.origin
  }})
}

</script>