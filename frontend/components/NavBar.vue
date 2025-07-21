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
        @click="openLoginModal"
        class="hover:underline text-secondary hover:text-primary hover:bg-transparent"
        variant="ghost"
      >
        <img v-if="theme === 'dark'" src="/imagen-de-perfil.png" class="w-[2.2rem]" alt="Login Icon">
        <img v-else src="/imagen-de-perfil-black.png" class="w-[2.2rem]" alt="Login Icon">
      </Button>
      <NuxtLink to="/dashboard" v-if="userStore?.isAuthenticated">
        <MenuDropdown />
      </NuxtLink>
    </div>
    <div class="flex justify-end xs:w-1/4 sm:w-1/3 md:hidden">
      <!--  <BurgerMenu /> -->
      <HamburgerMenu />
    </div>

    <!-- Login Warning Modal -->
    <ModalWarningLogin
      v-model="showLoginModal"
      @continuar="confirmLogin"
      @cancelar="cancelLogin"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth0 } from '@auth0/auth0-vue'

const userStore = useUserStore()
const router = useRouter()
const auth0 = ref(null)
const theme = computed(() => userStore.themePreference)

const showLoginModal = ref(false)

function openLoginModal() {
  showLoginModal.value = true
}

function cancelLogin() {
  showLoginModal.value = false
}

function confirmLogin() {
  showLoginModal.value = false
  if (auth0.value) {
    auth0.value.loginWithRedirect()
  }
}

onMounted(() => {
  auth0.value = useAuth0()
})
</script>

<style scoped>
/* Animación sencilla para que el modal entre suave */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(40px);}
  to   { opacity: 1; transform: translateY(0);}
}
.animate-fade-in {
  animation: fade-in 0.25s;
}
</style>
