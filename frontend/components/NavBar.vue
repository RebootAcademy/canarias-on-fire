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
    <div>
      <LangSelector />
    </div>
    <div class="text-sm font-bold flex gap-4">
      <div v-show="!isEventOrPaymentRoute">
        <Button variant="secondary" @click="handleCreateEvent">
          <span class="mr-2 text-lg ">+</span>
          {{  $t('createEvent') }}
        </Button>
      </div>
      <Button 
        v-if="!auth0?.isAuthenticated"
        @click="login"
        class="hover:underline"
      >
        {{ $t('login') }}
      </Button>
      <Button
        v-if="auth0?.isAuthenticated"
        @click="handleLogout"
        class="hover:underline"
      >
        {{ $t('logout') }}
      </Button>
      <NuxtLink to="/dashboard">
        <Avatar v-if="auth0?.isAuthenticated">
          <AvatarImage :src="user?.picture" alt="@radix-vue" />
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
const auth0 = ref(null)

onMounted(() => {
  auth0.value = useAuth0()
})

const login = () => {
  if (auth0.value) {
    auth0.value.loginWithRedirect({ appState: { target: '/dashboard' }})
  }
}

const handleLogout = () => {
  if (auth0.value) {
    auth0.value.logout({ logoutParams: {
      returnTo: window.location.origin
    }})
  }
}

const handleCreateEvent = () => {
  if (!auth0.value?.isAuthenticated) {
    auth0.value?.loginWithRedirect({
      appState: { returnTo: '/event' }
    })
  } else {
    navigateTo('/event')
  }
}

const isEventOrPaymentRoute = computed(() => {
  return route.path === '/event' || route.path === '/event-preview' || route.path === '/payment-options'
})

</script>