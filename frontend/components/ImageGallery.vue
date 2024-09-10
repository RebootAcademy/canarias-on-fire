<template>
  <div class="image-gallery p-4 text-white rounded-lg">
    <div class="cover-image mb-4 relative">
      <img v-if="coverImage || images[0]" :src="coverImage || images[0].url " alt="Cover Image" class="w-full h-64 object-cover rounded-lg" />
      <button v-if="coverImage" @click="removeCoverImage" class="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2">x</button>
    </div>
    <div class="image-upload mb-4">
      <label class="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:bg-gray-800">
        <span class="text-gray-400">+</span>
        <input type="file" @change="onFileChange" multiple class="hidden" />
      </label>
    </div>
    <div class="image-previews flex gap-4 overflow-x-auto">
      <div v-for="(image, index) in images" :key="index" class="image-preview relative">
        <img :src="image.url" @click="setCoverImage(image.url)" :class="{ 'border-4 border-orange-500': image.url === coverImage }" class="w-32 h-32 object-cover rounded-lg cursor-pointer" />
        <button @click="removeImage(image.url)" class="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1">x</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  storeType: {
    type: String,
    required: true,
    validator: (value) => ['event', 'article'].includes(value)
  }
})

const eventStore = useEventStore()
const cloudName = 'drs1a2bso'
const uploadPreset = 'evdhvl07'

const store = computed(() => {
  return props.storeType === 'event' ? useEventStore() : useArticleStore()
})

const images = computed(() => store.value[`${props.storeType}Images`])
const coverImage = computed(() => store.value.coverImage)

const onFileChange = async (event) => {
  const files = event.target.files
  for (let i = 0; i < files.length; i++) {
    const formData = new FormData()
    formData.append('file', files[i])
    formData.append('upload_preset', uploadPreset)

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      if (data.secure_url) {
        store.value[`add${props.storeType.charAt(0).toUpperCase() + props.storeType.slice(1)}Image`]({ url: data.secure_url })
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }
}

const setCoverImage = (url) => {
  store.value.setCoverImage(url)
}

const removeImage = (url) => {
  store.value[`remove${props.storeType.charAt(0).toUpperCase() + props.storeType.slice(1)}Image`](url)
  if (store.value.coverImage === url) {
    store.value.setCoverImage(null)
  }
}

 const removeCoverImage = () => {
  eventStore.setCoverImage(null)
} 
</script>

<style scoped>
.cover-image img {
  width: 100%;
  height: auto;
}
.image-upload {
  margin: 10px 0;
}
.image-previews {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  white-space: nowrap;
}
.image-preview {
  display: inline-block;
  flex: 0 0 auto; /* Prevent resizing */
}
.image-preview img {
  width: 128px; /* Fixed width */
  height: 128px; /* Fixed height */
  object-fit: cover;
  cursor: pointer;
}
.image-preview img.cover {
  border: 2px solid red;
}
.image-preview button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  cursor: pointer;
}

@media screen and (min-width: 1080px) {
  .cover-image img {
    width: 100%;
    height: 400px;
    background-clip: border-box;
    background-size: cover;
  }
}
</style>