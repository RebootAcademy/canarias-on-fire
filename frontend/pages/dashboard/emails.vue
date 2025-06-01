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
          />
        </div>
        <div class="mb-2">
          <Label class="block text-sm font-medium text-gray-300">
            {{ $t('imageEmail') }}</Label
          >
          <Input type="file" @change="handleFileChange" accept="image/*" />
          <div class="flex gap-x-4">
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
          </div>
        </div>
        <div>
          <img :src="urlImg" alt="Imagen subida" v-if="urlImg" />
        </div>
      </div>

      <button
        class="bg-transparent text-secondary border-2 border-primary hover:bg-primary-gradient hover:border-1 p-2"
        type="submit"
        :disabled="isUpdating"
      >
        {{ $t('dashboardNav.emails') }}
      </button>
    </form>
  </div>
</template>

<script setup>
const { t } = useI18n()
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()

definePageMeta({
  layout: 'dashboard',
})

const isUpdating = ref(false)
const selectedFile = ref(null)
const subject = ref('')
const urlImg = ref('')
const LastImgUrl = ref('')

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
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
    console.error('No file selected')
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
  try {
    const { data, error } = await useFetch(
      `${useRuntimeConfig().public.apiBaseUrl}/email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: urlImg.value,
          subject: subject.value,
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
console.log(subject.value)
</script>
