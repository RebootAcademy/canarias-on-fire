<template>
  <div class="max-w-4xl mx-auto px-4 py-8 flex flex-col bg-black">
    <h1 class="text-3xl font-bold mb-6">Create New Article</h1>
    <form @submit.prevent="createArticle">
      <div class="flex flex-col gap-1">
      <p class="font-semibold">{{ $t('selectImage') }}</p>
      <p class="text-xs text-gray-500 mb-2">Selecciona las imágenes que deseas mostrar en el artículo.</p>
      <ImageGallery store-type="article" />
    </div>
      <div class="mb-6">
        <h3 class="text-xl font-bold">Title</h3>
        <p class="text-sm opacity-60 mb-2">Please enter the title of your article.</p>
        <Input id="title" v-model="articleStore.title" required />
      </div>
      <div class="mb-6">
        <h3 class="text-xl font-bold">Content</h3>
        <p class="text-sm opacity-60 mb-2">Please enter the full content of your article.</p>
        <client-only>
          <QuillEditor v-model:content="articleStore.content" contentType="html" theme="snow" />
        </client-only>
      </div>
      <div class="flex justify-end mt-20 gap-8">
        <Button @click="cancelCreate" class="bg-gray-300 hover:bg-gray-400 text-gray-800">Cancel</Button>
        <Button type="submit">Crear Artículo</Button>
      </div>
    </form>
  </div>
</template>

<script setup>
const articleStore = useArticleStore()
const router = useRouter()

/* const article = ref({
  title: '',
  content: '',
  image: ''
}) */

const onImageUploaded = (imageUrl) => {
  article.value.image = imageUrl
}

const createArticle = async () => {
  const articleData = {
    title: articleStore.title,
    content: articleStore.content,
    articleImages: articleStore.articleImages,
    coverImage: articleStore.coverImage,
  }
  try {
    await articleStore.createArticle(articleData)
    router.push('/dashboard/articles')
  } catch (error) {
    console.error('Error creating article:', error)
  }
}

const cancelCreate = () => {
  router.push('/')
}
</script>