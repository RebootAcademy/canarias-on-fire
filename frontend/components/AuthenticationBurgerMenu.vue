<template>
  <div
    v-if="!auth0?.isAuthenticated"
    class="flex flex-row gap-2 px-2 py-2 font-bold text-lg cursor-pointer hover:text-primary"
    @click="openLoginModal"
  >
    <span class="ml-1">{{ $t('login') }}</span>
    <LogIn class="text-green-200" />
  </div>
  <div
    v-else
    class="flex flex-row gap-2 px-2 font-bold text-md cursor-pointer hover:text-primary"
    @click="handleLogout"
  >
    <span class="ml-1">{{ $t('logout') }}</span>

    <LogOut class="text-red-400" />
    <!-- Login Warning Modal -->
  </div>
  <ModalWarningLogin
    v-model="showLoginModal"
    @continuar="confirmLogin"
    @cancelar="cancelLogin"
  />
</template>

<script setup>
import { LogIn, LogOut } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'

const userStore = useUserStore()

const auth0 = ref(null) // Inicializamos una referencia para Auth0
const user = ref(null) // Inicializamos una referencia para el usuario

onMounted(() => {
  // Solo se debe ejecutar en el cliente
  if (typeof window !== 'undefined') {
    auth0.value = useAuth0()
  }
})

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

/* const handleLogin = () => {
  if (auth0.value) {
    auth0.value.loginWithRedirect()
  }
} */

const handleLogout = () => {
  if (auth0.value) {
    auth0.value.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })
    userStore.clearUserData()
  }
}
</script>
