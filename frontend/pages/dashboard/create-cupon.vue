<template>
  <div class="flex flex-col gap-4 w-[30rem]">
    <div>
      <Label class="block text-sm font-medium text-gray-300"> Nombre </Label>
      <Input
        v-model="nombre"
        type="text"
        placeholder="Nombre del Cupón"
        class="mt-1 block w-full text-gray-500"
        required
      />
    </div>
    <Button
      type="button"
      @click="generarCodigoPromo(nombre)"
      class="mt-4 bg-transparent text-secondary border-2 border-primary hover:bg-primary-gradient hover:border-1"
    >
      Crear
    </Button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast' // Ajusta la ruta a tu composable de toast
definePageMeta({ layout: 'dashboard' })

import { useAuth0 } from '@auth0/auth0-vue'

const config = useRuntimeConfig()
const { isAuthenticated, getAccessTokenSilently } = useAuth0()
let token = null
if (isAuthenticated.value) {
  token = await getAccessTokenSilently()
}

const { toast } = useToast()

const nombre = ref('')

async function generarCodigoPromo(nombre) {
  const res = await fetch(
    `${config.public.apiBaseUrl}/stripe-promo/create-promo-code`,
    {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: nombre, months: 2 }),
    }
  )

  const data = await res.json()
  if (data.success) {
    toast({
      description: `Código creado: ${data.promoCode.code}`,
    })
  } else if (data.statusCode === 400) {
    toast({
      description: 'Ese código ya existe',
      variant: 'destructive',
    })
  } else {
    toast({
      description: `Error: ${data.details}`,
      variant: 'destructive',
    })
  }
}
</script>
