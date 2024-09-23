<template>
  <div class="h-16 bg-black flex items-end justify-between px-4 py-2">
    
    <div class="flex xs:justify-center md:justify-start xs:2/4 sm:w-1/3 text-3xl ml-1 font-extrabold">
      <NuxtLink to="/" class="flex items-end">
        <NuxtImg src="logo_color.png" class="w-28 md:w-36" />
      </NuxtLink>
    </div>
    <div class="hidden md:flex w-1/3 justify-center">
      <NavMenu />
    </div>
    <div class="hidden md:flex text-sm font-bold  md:gap-4 sm:w-1/3 justify-end">
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
    <div class="flex justify-end xs:w-1/4 sm:w-1/3 md:hidden">
    <BurgerMenu />
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
    auth0.value.loginWithRedirect()
  }
}



</script>