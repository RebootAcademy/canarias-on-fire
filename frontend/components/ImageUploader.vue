<template>
  <div class="flex flex-col gap-2">
    <div class="flex gap-4 w-2/3">
      <Input 
        type="file"
        @change="handleFileChange"
      />
      <Button @click="uploadImage" class="text-xs px-4">
        Upload Image
      </Button>
    </div>
    <Label class="text-xs ml-1">
      Preview
    </Label>
    <NuxtImg 
      v-if="typeof eventStore.eventImg === 'string'" 
      :src="eventStore.eventImg" 
      width="150" 
    />
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'

const eventStore = useEventStore()
const cloudName = 'drs1a2bso'

const handleFileChange = (event) => {
  eventStore.selectedFile = event.target.files[0]
  console.log(eventStore.selectedFile)
}

const uploadImage = async () => {
  if (!eventStore.selectedFile) {
    console.error('No file selected')
    return
  }

  try {
    const formData = new FormData()
    formData.append("file", eventStore.selectedFile)
    formData.append("upload_preset", "evdhvl07")

    const { data, error } = await useFetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })

    if (error.value) {
      console.error(error.value)
      return
    }

    eventStore.eventImg = data.value.secure_url
    console.log('Uploaded Image URL:', eventStore.eventImg)
  } catch (error) {
    console.error(error)
  }
}
</script>

