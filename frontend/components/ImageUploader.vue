<template>
  <div class="flex flex-col gap-2 text-gray-500">
    <div class="flex gap-4 w-2/3">
      <Input 
        type="file"
        @change="handleFileChange"
      />
      <Button @click.prevent="uploadImage" class="text-xs px-4">
        {{ $t('uploadImage') }}
      </Button>
    </div>
    <Label class="text-xs ml-1">
      {{ $t('previewImg') }}
    </Label>
    <NuxtImg 
      v-if="imageUrl" 
      :src="imageUrl" 
      width="150" 
    />
  </div>
</template>

<script setup>
const emit = defineEmits(['image-uploaded'])
const cloudName = 'drs1a2bso'
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
    formData.append("upload_preset", "evdhvl07")

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

