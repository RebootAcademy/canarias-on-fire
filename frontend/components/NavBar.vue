<template>
  <div class="h-16 bg-background text-secondary flex items-end justify-between px-4 py-2">
    <div class="flex xs:justify-center md:justify-start xs:2/4 sm:w-1/3 text-3xl ml-1 font-extrabold">
      <NuxtLink to="/" class="flex items-end">
        <NuxtImg src="/logo_color.png" alt="Evente Logo" class="hidden sm:block w-28 md:w-36" />
        <NuxtImg src="/v_logo.png" alt="Evente Logo" class="sm:hidden w-10" />
      </NuxtLink>
    </div>
    <div class="hidden md:flex w-1/3 justify-center">
      <NavMenu />
    </div>
    <div class="hidden md:flex items-center text-sm font-bold  md:gap-4 md:w-1/3 justify-end">
      <LangSelector />
     <!--  <Notifications /> -->
      <ThemeSwitcher />
      <Button 
        v-if="!userStore?.isAuthenticated"
        @click="login"
        class="hover:underline text-secondary hover:text-primary hover:bg-transparent"
        variant="ghost"
      >
        {{ $t('login') }}
      </Button>
      <NuxtLink to="/dashboard" v-if="userStore?.isAuthenticated">
        <MenuDropdown />
      </NuxtLink>
    </div>
    <div class="flex justify-end xs:w-1/4 sm:w-1/3 md:hidden">
   <!--  <BurgerMenu /> -->
     <HamburgerMenu />
    </div>
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
const userStore = useUserStore()

const auth0 = ref(null)
const theme = ref('dark')

function toggleTheme() {
  if (theme.value === 'dark') {
    document.body.classList.add('light');
    theme.value = 'light';
  } else {
    document.body.classList.remove('light');
    theme.value = 'dark';
  }
}

onMounted(() => {
  auth0.value = useAuth0()
})

const login = () => {
  if (auth0.value) {
    auth0.value.loginWithRedirect()
  }
}

</script>