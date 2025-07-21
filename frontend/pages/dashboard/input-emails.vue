<template>
  <div class="flex flex-col gap-4 w-[30rem]">
    <div>
      <Label class="block text-sm font-medium text-gray-300"> Nombre </Label>
      <Input
        v-model="nombre"
        type="text"
        placeholder="nombre (Puede quedarse vacio)"
        class="mt-1 block w-full text-gray-500"
      />
    </div>
    <div>
      <Label class="block text-sm font-medium text-gray-300">{{
        $t('email')
      }}</Label>
      <Input
        v-model="correo"
        type="text"
        placeholder="Correo"
        class="mt-1 block w-full text-gray-500"
        required
      />
    </div>
    <!-- Selector tipo -->
    <div
      class="mt-4 border-2 rounded-md border-primary w-full md:w-[200px] text-center"
      role="combobox"
      :aria-expanded="open"
      aria-haspopup="listbox"
    >
      <button
        :key="selectedOption"
        type="button"
        class="bg-transparent text-secondary hover:bg-primary-gradient w-full flex items-center justify-center p-2"
        @click="toggleOpen"
        :aria-label="
          selectedOption
            ? `Tipo seleccionado: ${selectedOption}`
            : 'Selecciona un tipo'
        "
      >
        <span v-if="!selectedOption" class="text-[0.875rem] font-semibold">
          Selecciona un tipo
        </span>
        <span v-else class="text-[0.875rem] font-semibold">
          {{ selectedOption }}
        </span>
      </button>

      <!-- Opciones de tipo -->
      <ul
        v-if="open"
        class="z-50 w-full bg-black border border-primary"
        role="listbox"
      >
        <li
          v-for="tipo in optionsType"
          :key="tipo"
          class="p-2 text-secondary hover:bg-primary-gradient cursor-pointer"
          @click="selectOption(tipo)"
          role="option"
          :aria-selected="selectedOption === tipo"
        >
          {{ tipo }}
        </li>
      </ul>
    </div>
    <Button
      type="button"
      @click="enviarCliente"
      class="mt-4 bg-transparent text-secondary border-2 border-primary hover:bg-primary-gradient hover:border-1"
    >
      Añadir
    </Button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast' // Ajusta la ruta a tu composable de toast

definePageMeta({ layout: 'dashboard' })

import { useAuth0 } from '@auth0/auth0-vue'
const { isAuthenticated, getAccessTokenSilently } = useAuth0()
let token = null
if (isAuthenticated.value) {
  token = await getAccessTokenSilently()
}

const { toast } = useToast()

const selectedOption = ref(null)
const open = ref(false)
const optionsType = [
  'AYTO',
  'CIAS',
  'PROMOTORES',
  'SURFSCHOOL',
  'TEMATICOS',
  'GROUPON',
]
const nombre = ref('')
const correo = ref('')

const selectOption = (option) => {
  selectedOption.value = option
  open.value = false
}

const toggleOpen = () => {
  open.value = !open.value
}

const enviarCliente = async () => {
  if (!correo.value || !selectedOption.value) {
    toast({
      description: 'Por favor, rellena el correo y selecciona un tipo.',
      variant: 'destructive',
    })
    return
  }

  const payload = {
    correo: correo.value,
    tipo: selectedOption.value,
  }
  if (nombre.value) {
    payload.nombre = nombre.value
  }

  try {
    const config = useRuntimeConfig()
    const res = await fetch(
      `${config.public.apiBaseUrl}/newsletter/add-email`,
      {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )
    const data = await res.json()
    if (data.success) {
      toast({
        description: 'Correo añadido correctamente.',
      })
      nombre.value = ''
      correo.value = ''
      selectedOption.value = null
    } else {
      toast({
        description: data.message || 'Error al añadir el Correo.',
        variant: 'destructive',
      })
    }
  } catch (err) {
    toast({
      description: 'Error de red al añadir cliente.',
      variant: 'destructive',
    })
    console.error(err)
  }
}
</script>
