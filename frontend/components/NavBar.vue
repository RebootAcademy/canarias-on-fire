<template>
  <div class="h-16 bg-black flex items-end justify-between px-4 py-2 text-white">
    <div class="flex text-2xl font-extrabold">
      <NuxtLink to="/" class="flex items-end">
        <p class="text-white">Canarias</p>
        <div class="flex items-end">
          <span class="text-normal text-orange-400 z-10">onFire</span>
          <!-- <span class="text-orange-600 ml-[-19px] mb-[6px] z-0"><Flame size="22" /></span> -->
        </div>
      </NuxtLink>
    </div>
    <div class="text-sm font-bold flex gap-4">
      <div v-show="!isEventOrPaymentRoute">
        <NuxtLink to="/event">
          <Button variant="secondary">
            <span class="mr-2 text-lg ">+</span>Create Event
          </Button>
        </NuxtLink>
      </div>
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
import { Flame } from 'lucide-vue-next'

const route = useRoute()

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

const isEventOrPaymentRoute = computed(() => {
  return route.path === '/event' || route.path === '/event-preview' || route.path === '/payment-options'
})

</script>