<template>
  <div>
    <form @submit.prevent="sendEmail">
      <div class="flex flex-col gap-4">
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
        <div class="mb-2">
          <Label class="block text-sm font-medium text-gray-300">
            {{ $t('imageEmail') }}</Label
          >
          <Input type="file" @change="handleFileChange" accept="image/*" />
          <div class="flex gap-x-4 flex-col md:flex-row">
            <Button
              type="button"
              @click="uploadImage"
              class="mt-4 bg-transparent text-secondary border-2 border-primary hover:bg-primary-gradient hover:border-1"
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

<div
               class="mt-4 border-2 rounded-md border-primary w-full md:w-[200px] text-center"
              role="combobox"
              :aria-expanded="open"
              aria-haspopup="listbox"
             >
               <button
                 type="button"
                 :class="[
                   'bg-transparent text-secondary hover:bg-primary-gradient w-full flex items-center justify-center p-2',
                   { 'h-full': !open },
                 ]"
                 @click="toggleOpen"
                :aria-label="selectedOption ? `Tipo seleccionado: ${selectedOption}` : 'Selecciona un tipo'"
               >
                 <span class="text-[0.875rem] font-semibold">{{
                   selectedOption || 'Selecciona un tipo'
                 }}</span>
               </button>

               <ul
                 v-if="open"
                 class="z-50 w-full bg-black border border-primary"
                role="listbox"
                :aria-label="'Opciones de tipo de cliente'"
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
        </div>
        <div>
          <img :src="urlImg" alt="Imagen subida" v-if="urlImg" />
        </div>
      </div>

      <Button
        class="mt-4 bg-transparent text-secondary border-2 border-primary hover:bg-primary-gradient hover:border-1 p-2 w-full md:w-auto"
        type="submit"
        :disabled="isUpdating"
      >
        {{ $t('dashboardNav.emails') }}
      </Button>
    </form>
  </div>
</template>

<script setup>
const { t } = useI18n()
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
const optionsType = ['AYTO', 'CIAS', 'PROMOTORES', 'SURFSCHOOL', 'TEMATICOS']

definePageMeta({
  layout: 'dashboard',
})

const isUpdating = ref(false)
const selectedFile = ref(null)
const subject = ref('')
const urlImg = ref('')
const LastImgUrl = ref('')

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast({
      description: t('notIsImage'),
      variant: 'destructive',
    })
    return
  }

  selectedFile.value = file // Ahora sí, archivo válido
}

const HandleLastImgUrl = () => {
  LastImgUrl.value = localStorage.getItem('lastImageUrl')
  if (LastImgUrl.value) {
    urlImg.value = LastImgUrl.value
  } else {
    toast({
      description: t('noPreviousImage'),
      variant: 'destructive',
    })
  }
}

const uploadImage = async () => {
  isUpdating.value = true

  if (!selectedFile.value) {
    toast({
      description: t('notIsImage'),
      variant: 'destructive',
    })
    isUpdating.value = false
    return
  }

  const config = useRuntimeConfig()

  const cloudName = config.public.cloudinaryCloudName
  const uploadPreset = config.public.cloudinaryUploadPreset

  const formDataForUpload = new FormData()
  formDataForUpload.append('file', selectedFile.value)
  formDataForUpload.append('upload_preset', uploadPreset)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formDataForUpload,
      }
    )

    const data = await response.json()
    if (data.secure_url) {
      urlImg.value = data.secure_url
      localStorage.setItem('lastImageUrl', urlImg.value)
    }
    isUpdating.value = false
  } catch (error) {
    isUpdating.value = false
    console.error('Error uploading image:', error)
  }
}

const sendEmail = async () => {
  isUpdating.value = true

  if (!urlImg.value) {
    toast({
      description: t('Not is a Image'),
      variant: 'destructive',
    })
    isUpdating.value = false
    return
  }

  if (!selectedOption.value) {
    toast({
      description: t('select a Type'), // o un texto como "Debes seleccionar un tipo"
      variant: 'destructive',
    })
    isUpdating.value = false
    return
  }
  try {
    const { data, error } = await useFetch(
      `${useRuntimeConfig().public.apiBaseUrl}/newsletter/send-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: urlImg.value,
          subject: subject.value,
          type: selectedOption.value,
        }),
      }
    )

    if (error.value || !data.value?.success) {
      toast({
        description: t('errorSendingEmail'),
        variant: 'destructive',
      })
    } else {
      toast({
        description: t('emailSent'),
      })
      subject.value = ''
      urlImg.value = ''
      selectedFile.value = null
      LastImgUrl.value = ''
      selectedOption.value = null
    }
  } catch (error) {
    console.error('Error sending email:', error)
    toast({
      description: t('errorSendingEmail'),
      variant: 'destructive',
    })
  } finally {
    isUpdating.value = false
  }
}

const open = ref(false)
const selectedOption = ref(null)

const toggleOpen = () => {
  open.value = !open.value
}

const selectOption = (option) => {
  selectedOption.value = option
  open.value = false
}
</script>
