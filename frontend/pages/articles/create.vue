<template>
  <div class="mx-auto px-4 py-8 flex flex-col bg-background">
    <h1 class="text-primary text-2xl lg:text-[38px] font-bold mb-6">{{ $t('createArticle') }}</h1>
    <form @submit.prevent="createArticle">
      <div class="flex flex-col gap-1">
        <p class="font-semibold">{{ $t('selectImage') }}</p>
        <p class="text-xs text-gray-500 mb-2">{{ $t('selectImageArticle') }}</p>
        <ImageGallery store-type="article" />
      </div>
      <div class="mb-6">
        <h3 class="text-xl font-bold">{{ $t('articleTitle') }}</h3>
        <p class="text-sm opacity-60 mb-2">
          {{ $t('articleTitleDescription') }}
        </p>
        <Input id="title" v-model="articleStore.title" required />
      </div>
      <div class="mb-6">
        <h3 class="text-xl font-bold">{{ $t('articleContent') }}</h3>
        <p class="text-sm opacity-60 mb-2">
          {{ $t('articleContentDescription') }}
        </p>
        <client-only>
          <QuillEditor
            v-model:content="articleStore.content"
            contentType="html"
            theme="snow"
          />
        </client-only>
      </div>
      <div class="flex justify-end mt-20 gap-4">
        <Button
          @click="cancelCreate"
          class="bg-gray text-secondary px-6 p-5 hover:bg-red-300 hover:text-black"
          >{{ $t('buttons.cancel') }}</Button
        >
        <Button type="submit" class="px-6 hover:bg-primary-gradient">{{ $t('buttons.create') }}</Button>
      </div>
    </form>
  </div>
</template>

<script setup>
const articleStore = useArticleStore()
const userStore = useUserStore()
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
    userId: userStore.userData._id
  }


  if (articleData.coverImage === null && articleData.articleImages.length > 0) {
    articleData.coverImage = articleData.articleImages[0].url
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
