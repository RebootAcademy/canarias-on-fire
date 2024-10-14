<template>
  <div class="flex flex-col image-gallery p-4 text-white rounded-lg">
    <div class="cover-image mb-4 relative">
      <img
        v-if="coverImage || images[0]"
        :src="coverImage || images[0].url"
        alt="Cover Image"
        class="w-full h-64 object-cover rounded-lg"
      />
      <button
        v-if="coverImage"
        @click="removeCoverImage"
        class="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2"
      >
        x
      </button>
    </div>
    <div class="flex flex-col lg:flex-row gap-4 items-center">
      <div
        v-if=" images?.length < checkMaxImages()"
        class="image-upload mb-4 w-full lg:max-w-40 lg:min-w-40"
      >
        <label
          class="flex items-center justify-center h-32 border-2 border-primary rounded-lg cursor-pointer hover:bg-gray-800"
        >
          <span class="text-primary text-4xl">+</span>
          <input type="file" @change="onFileChange" multiple class="hidden" />
        </label>
      </div>
      <div
        class="hidden md:flex image-previews gap-4 overflow-x-auto xs:pb-4 md:pb-0"
      >
        <div
          v-for="(image, index) in images"
          :key="index"
          class="image-preview relative"
        >
          <img
            :src="image.url"
            @click="setCoverImage(image.url)"
            :class="{ 'border-4 border-orange-500': image.url === coverImage }"
            class="w-32 h-32 object-cover rounded-lg cursor-pointer"
          />
          <button
            @click="removeImage(image.url)"
            class="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
          >
            x
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useToast } from '@/components/ui/toast/use-toast'

const props = defineProps({
  storeType: {
    type: String,
    required: true,
    validator: (value) => ['event', 'article'].includes(value),
  },
})

const { t } = useI18n()
const { toast } = useToast()
const eventStore = useEventStore()
const articleStore = useArticleStore()
const config = useRuntimeConfig()
const cloudName = config.public.cloudinaryCloudName
const uploadPreset = config.public.cloudinaryUploadPreset

const store = computed(() => {
  return props.storeType === 'event' ? eventStore : articleStore
})

console.log(store.value)
const checkMaxImages = () => {
  if (!store?.value?.event?.payment?.name) return 10
  if (store?.value?.event?.eventType === 'promotion') return 10
  switch (store.value.event.payment.name) {
    case 'optima':
      return 5
    case 'optima plus':
      return 10
    default:
      return 0
  }
}

const images = computed(() => {
    return store.value[`${props.storeType}Images`]
})

const coverImage = computed(() => {
  console.log(store.value.coverImage)
  return store.value.coverImage
})

watch(
  () => coverImage,
  (newValue) => {
    console.log(newValue)
  }
)
const onFileChange = async (event) => {
  const files = event.target.files
  for (let i = 0; i < files.length; i++) {
    const formData = new FormData()
    formData.append('file', files[i])
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
        store.value[
          `add${
            props.storeType.charAt(0).toUpperCase() + props.storeType.slice(1)
          }Image`
        ]({ url: data.secure_url })
      }

      if (!coverImage.value && files.length) {
        eventStore.coverImage = data.secure_url
      }

      if (
        props.storeType !== 'article' &&
        images.value.length === checkMaxImages()
      ) {
        toast({
          description: t('galleryLimit'),
          variant: 'destructive',
        })
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
  store.value[
    `remove${
      props.storeType.charAt(0).toUpperCase() + props.storeType.slice(1)
    }Image`
  ](url)
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

.image-previews::-webkit-scrollbar {
  height: 12px;
}

.image-previews::-webkit-scrollbar-track {
  background: #333; /* Color del fondo del track */
  border-radius: 10px; /* Bordes redondeados */
}

.image-previews::-webkit-scrollbar-thumb {
  background-color: #ff6600; /* Color de la barra */
  border-radius: 10px; /* Bordes redondeados */
  border: 3px solid #333; /* Espacio entre el scroll y el track */
}

/* Opcional: Si deseas modificar el hover de la barra */
.image-previews::-webkit-scrollbar-thumb:hover {
  background-color: #ff9900; /* Color de hover */
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
