<template>
  <div class="flex !flex-col min-h-full w-full xs:p-4 sm:p-14 lg:p-8 lg:px-24">
    <Spinner v-if="isLoading" />
    <div class="flex flex-col items-center" v-else-if="!userVerified">
      {{ $t('onBoarding.validateEmail') }}
      <Button class="mt-4 w-full md:w-[50vw]" @click="checkVerification">
        {{ $t('onBoarding.checkVerification') || 'Comprobar ahora' }}
      </Button>
    </div>
    <!-- Directamente el formulario de empresa -->
    <div v-else>
      <CompanyDetailsForm @back="cancelAndLogout()" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()

const { isAuthenticated, getAccessTokenSilently, logout, loginWithRedirect } =
  useAuth0()
const userStore = useUserStore()
const router = useRouter()

const isLoading = ref(true)
const userVerified = ref(false)

function cancelAndLogout() {
  logout({
    logoutParams: {
      returnTo: window.location.origin + '/', // o la ruta que quieras
    },
  })
  userStore.clearUserData()
}

onMounted(async () => {
  const config = useRuntimeConfig()
  try {
    if (isAuthenticated.value) {
      const accessToken = await getAccessTokenSilently()
      const response = await fetch(
        `https://${config.public.auth0Domain}/userinfo`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
      const user = await response.json()
      userVerified.value = user.email_verified || false
    }
  } catch (error) {
    console.error('Error fetching user info:', error)
  } finally {
    isLoading.value = false
  }
})

async function checkVerification() {
  isLoading.value = true
  try {
    const accessToken = await getAccessTokenSilently({ ignoreCache: true })
    const config = useRuntimeConfig()
    const response = await fetch(
      `https://${config.public.auth0Domain}/userinfo`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
    const user = await response.json()
    if (!user.email_verified) {
      // Si sigue sin verificar, puedes mostrar toast o mensaje
      toast({
        description: 'Aún no has verificado tu email.',
        variant: 'destructive',
      })
      return
    }
    userVerified.value = true
    
  } catch (error) {
    console.error('Error checking verification:', error)
  } finally {
    isLoading.value = false
  }
}
</script>