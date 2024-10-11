<template>
  <div class="flex flex-col items-center gap-2 text-gray-500 mb-4">
    <div class="rounded-full border border-primary w-32 h-32 mb-4 flex items-center justify-center text-3xl font-bold text-secondary overflow-hidden">
      <img 
      v-if="imageUrl" 
      :src="imageUrl" 
      width="150" 
      class="object-cover rounded-md object-center "
      />
    </div>
   <!--  <Label v-if="imageUrl" class="text-xs ml-1">
      {{ $t('previewImg') }}
    </Label> -->
    <div class="flex gap-4 lg:w-2/3">
      <Input 
        type="file"
        class="text-secondary cursor-pointer "
        @change="handleFileChange"
        placeholder="Select an image"
      />
      <Button @click.prevent="uploadImage" class="text-xs px-4 bg-primary-gradient hover:text-secondary">
        {{ $t('uploadImage') }}
      </Button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['image-uploaded'])
const config = useRuntimeConfig()
const cloudName = config.public.cloudinaryCloudName
const uploadPreset = config.public.cloudinaryUploadPreset

const selectedFile = ref(null)
const imageUrl = ref('')

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
}

const uploadImage = async () => {
  if (!selectedFile.value) {
    console.error('No file selected')
    return
  }

  try {
    const formData = new FormData()
    formData.append("file", selectedFile.value)
    formData.append("upload_preset", uploadPreset)

    const { data, error } = await useFetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })

    if (error.value) {
      console.error(error.value)
      return
    }

    imageUrl.value = data.value.secure_url
    emit('image-uploaded', imageUrl.value)
  } catch (error) {
    console.error(error)
  }
}
</script>

