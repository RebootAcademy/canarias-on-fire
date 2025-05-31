<template>
  <div>
    <form @submit.prevent="sendEmail">
      <div class="mb-4">
        <div class="mb-4">
          <Label class="block text-sm font-medium text-gray-300">
            {{ $t('imageEmail') }}</Label
          >
          <Input type="file" @change="handleFileChange" accept="image/*" />
          <Button
            type="button"
            @click="uploadImage"
            class="mt-2 bg-transparent text-secondary border-2 border-primary hover:bg-primary-gradient hover:border-1"
          >
            {{ isUpdating ? $t('buttons.updating') : $t('buttons.upload') }}
          </Button>
        </div>
        <div>
          <img :src="urlImg" alt="Imagen subida" v-if="urlImg" />
        </div>
      </div>

      <button
        class="bg-transparent text-secondary border-2 border-primary hover:bg-primary-gradient hover:border-1"
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
const urlImg = ref('')

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
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
</script>
