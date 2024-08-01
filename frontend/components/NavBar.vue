<template>
  <div class="h-16 bg-black flex items-end justify-between px-4 py-2">
    <div class="flex text-3xl ml-1 font-extrabold">
      <NuxtLink to="/" class="flex items-end">
        <p class="text-blue-400">e</p>
        <div class="flex items-end">
          <span class="text-normal text-white z-10">venTe</span>
        </div>
      </NuxtLink>
    </div>
    <div>
      <NavMenu />
    </div>
    <div class="text-sm font-bold flex gap-4">
      <LangSelector />
      <Notifications />
      <Button 
        v-if="!auth0?.isAuthenticated"
        @click="login"
        class="hover:underline text-white"
        variant="ghost"
      >
        {{ $t('login') }}
      </Button>
      <NuxtLink to="/dashboard" v-if="auth0?.isAuthenticated">
        <MenuDropdown />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'

const auth0 = ref(null)

onMounted(() => {
  auth0.value = useAuth0()
})

const login = () => {
  if (auth0.value) {
    auth0.value.loginWithRedirect({ appState: { target: '/dashboard' }})
  }
}



</script>