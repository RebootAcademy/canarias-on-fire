<template>
  <!-- Formulario principal -->
  <div>
    <form @submit.prevent="handleSendEmail">
      <div class="flex flex-col gap-4">
        <!-- Asunto -->
        <div>
          <Label class="block text-sm font-medium text-gray-300">{{
            $t('contact.subject')
          }}</Label>
          <Input
            v-model="subject"
            type="text"
            placeholder="Asunto del correo"
            class="mt-1 block w-full text-gray-500"
            required
          />
        </div>

        <!-- Imagen y tipo de envío -->
        <div class="mb-2">
          <!-- Subida de imagen -->
          <Label class="block text-sm font-medium text-gray-300">{{
            $t('imageEmail')
          }}</Label>
          <Input type="file" @change="handleFileChange" accept="image/*" />

          <!-- Botones: subir imagen y usar última imagen -->
          <div class="flex gap-x-4 flex-col md:flex-row">
            <Button
              type="button"
              @click="uploadImage"
              :class="[
                'mt-4 bg-transparent text-secondary border-2 border-primary hover:bg-primary-gradient hover:border-1',
                errorFields.includes('img')
                  ? 'border-red-500'
                  : 'border-primary',
              ]"
            >
              {{ isUpdating ? $t('buttons.updating') : $t('buttons.upload') }}
            </Button>

            <Button
              type="button"
              @click="HandleLastImgUrl"
              class="mt-4 bg-transparent text-secondary border-2 border-primary hover:bg-primary-gradient hover:border-1"
            >
              Usar última imagen
            </Button>

            <!-- Selector tipo -->
            <div
              :class="[
                'mt-4 border-2 rounded-md border-primary w-full md:w-[200px] text-center',
                errorFields.includes('type')
                  ? 'border-red-500'
                  : 'border-primary',
              ]"
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
                <span
                  v-if="!selectedOption"
                  class="text-[0.875rem] font-semibold"
                >
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
          </div>

          <!-- Selector prueba -->
          <div
            :class="[
              'mt-4 border-2 rounded-md border-primary w-full md:w-[200px] text-center',
              errorFields.includes('test')
                ? 'border-red-500'
                : 'border-primary',
            ]"
            :aria-expanded="openTest"
            aria-haspopup="listbox"
          >
            <button
              :key="selectedOptionTest"
              type="button"
              class="bg-transparent text-secondary hover:bg-primary-gradient w-full flex items-center justify-center p-2"
              @click="toggleOpenTest"
            >
              <span
                v-if="!selectedOptionTest"
                class="text-[0.875rem] font-semibold"
              >
                Es una prueba
              </span>
              <span v-else class="text-[0.875rem] font-semibold">
                {{ selectedOptionTest }}
              </span>
            </button>

            <!-- Opciones prueba -->
            <ul
              v-if="openTest"
              class="z-50 w-full bg-black border border-primary"
            >
              <li
                v-for="option in optionTest"
                :key="option"
                class="p-2 text-secondary hover:bg-primary-gradient cursor-pointer"
                @click="selectTest(option)"
              >
                {{ option }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Vista previa imagen -->
        <div>
          <img :src="urlImg" alt="Imagen subida" v-if="urlImg" />
        </div>
      </div>

      <!-- Botón enviar -->
      <Button
        class="mt-4 bg-transparent text-secondary border-2 border-primary hover:bg-primary-gradient hover:border-1 p-2 w-full md:w-auto"
        type="submit"
        :disabled="isUpdating"
      >
        {{ $t('dashboardNav.emails') }}
      </Button>
    </form>
  </div>

  <!-- Modal de confirmación -->
  <div
    v-if="openLastCheck"
    class="fixed border-2 border-primary bg-black/80 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] w-[20rem] h-[12rem]"
  >
    <div class="w-full flex items-center justify-center h-[50%]">
      <p class="text-center">
        Este envio no es una prueba<br />
        Estas seguro?
      </p>
    </div>
    <div
      class="w-full h-[50%] flex items-center justify-center gap-x-4 gap-y-2"
    >
      <Button
        @click="handleLastCheck(false)"
        class="bg-transparent text-secondary border-2 border-primary hover:bg-primary-gradient hover:border-1 md:w-auto"
      >
        {{ $t('buttons.cancel') }}
      </Button>
      <Button
        @click="handleLastCheck(true)"
        class="bg-transparent text-secondary border-2 border-primary hover:bg-primary-gradient hover:border-1 md:w-auto"
      >
        {{ $t('buttons.confirm') }}
      </Button>
    </div>
  </div>

  <!-- Fondo difuminado modal -->
  <div
    v-if="openLastCheck"
    class="fixed inset-0 z-[30] bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center"
  ></div>
</template>

<script setup>
/* Composables y configuración */
import { useToast } from '@/components/ui/toast/use-toast'
import { ref, watch } from 'vue'

const { t } = useI18n()
const { toast } = useToast()

definePageMeta({ layout: 'dashboard' })

/* Estado general */
const subject = ref('')
const selectedFile = ref(null)
const urlImg = ref('')
const LastImgUrl = ref('')
const isUpdating = ref(false)
const errorFields = ref([])

const open = ref(false)
const openTest = ref(false)
const openLastCheck = ref(false)

const selectedOption = ref(null)
const selectedOptionTest = ref(null)
const lastCheck = ref(false)

/* Opciones de tipo y prueba */
const optionsType = ['AYTO', 'CIAS', 'PROMOTORES', 'SURFSCHOOL', 'TEMATICOS']
const optionTest = ['SI', 'NO']

/* Modal: promesa que espera confirmación */
let resolveModalPromise = null
const confirmModal = () => {
  return new Promise((resolve) => {
    openLastCheck.value = true
    resolveModalPromise = resolve
  })
}

/* Selección de opciones */
const selectOption = (option) => {
  selectedOption.value = option
  errorFields.value = []
  open.value = false
}

const selectTest = (option) => {
  selectedOptionTest.value = option
  errorFields.value = []
  openTest.value = false
}

/* Toggle dropdowns */
const toggleOpen = () => {
  open.value = !open.value
  if (open.value) openTest.value = false
}

const toggleOpenTest = () => {
  openTest.value = !openTest.value
  if (openTest.value) open.value = false
}

/* Modal: manejar confirmación */
const handleLastCheck = (option) => {
  lastCheck.value = option
  openLastCheck.value = false
  if (resolveModalPromise) {
    resolveModalPromise(option)
  }
}

/* Subida de imagen */
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast({ description: t('notIsImage'), variant: 'destructive' })
    return
  }

  selectedFile.value = file
}

const uploadImage = async () => {
  isUpdating.value = true
  if (!selectedFile.value) {
    toast({ description: t('notIsImage'), variant: 'destructive' })
    isUpdating.value = false
    return
  }

  const config = useRuntimeConfig()
  const cloudName = config.public.cloudinaryCloudName
  const uploadPreset = config.public.cloudinaryUploadPreset

  const formData = new FormData()
  formData.append('file', selectedFile.value)
  formData.append('upload_preset', uploadPreset)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )
    const data = await response.json()
    if (data.secure_url) {
      urlImg.value = data.secure_url
      localStorage.setItem('lastImageUrl', urlImg.value)
    }
  } catch (error) {
    console.error('Error uploading image:', error)
  } finally {
    isUpdating.value = false
  }
}

/* Usar última imagen guardada */
const HandleLastImgUrl = () => {
  LastImgUrl.value = localStorage.getItem('lastImageUrl')
  if (LastImgUrl.value) {
    urlImg.value = LastImgUrl.value
  } else {
    toast({ description: t('noPreviousImage'), variant: 'destructive' })
  }
}

/* Enviar email */
const sendEmail = async () => {
  isUpdating.value = true


  try {
    const response = await $fetch(
      `${useRuntimeConfig().public.apiBaseUrl}/newsletter/send-email`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: urlImg.value,
          subject: subject.value,
          type: selectedOption.value,
          test: selectedOptionTest.value === 'SI',
        }),
      }
    )

    if (response.success) {

      toast({ description: t('emailSent') })
      // Resetear formulario
      subject.value = ''
      urlImg.value = ''
      selectedFile.value = null
      LastImgUrl.value = ''
      selectedOption.value = null
      selectedOptionTest.value = null
      open.value = false
      openTest.value = false
    } else {
      toast({ description: t('errorSendingEmail'), variant: 'destructive' })
    }
  } catch (error) {
    console.error('Error sending email:', error)
    toast({ description: t('errorSendingEmail'), variant: 'destructive' })
  } finally {
    isUpdating.value = false
  }
}

/* Lógica de envío con validaciones */
const handleSendEmail = async () => {
  errorFields.value = []

  if (!urlImg.value) {
    errorFields.value.push('img')
    toast({
      description: t('Carga una imagen o usa la ultima que usaste!'),
      variant: 'destructive',
    })
    isUpdating.value = false
    return
  }

  if (!selectedOption.value) {
    errorFields.value.push('type')
    toast({
      description: t('Debes seleccionar un tipo'),
      variant: 'destructive',
    })
    isUpdating.value = false
    return
  }

  if (!selectedOptionTest.value) {
    errorFields.value.push('test')
    toast({ description: t('Es una prueba ?'), variant: 'destructive' })
    isUpdating.value = false
    return
  }

  // Confirmar si NO es una prueba
  if (selectedOptionTest.value === 'NO') {
    const confirmed = await confirmModal()
    if (!confirmed) {
      isUpdating.value = false
      return
    }
  }


  await sendEmail()
}
</script>
