<template>
  <div class="max-w-4xl mx-auto px-4 py-8 flex flex-col">
    <h1 class="text-3xl font-bold mb-6">Edit Article</h1>
    <form @submit.prevent="updateArticle" v-if="article">
      <div class="mb-6">
        <h3 class="text-xl font-bold">Image</h3>
        <p class="text-sm opacity-60 mb-2">Update the image for your article if needed.</p>
        <ImageUploader @image-uploaded="onImageUploaded" :initial-image="article.image" />
      </div>
      <div class="mb-6">
        <h3 class="text-xl font-bold">Title</h3>
        <p class="text-sm opacity-60 mb-2">Please enter the title of your article.</p>
        <Input id="title" v-model="article.title" required />
      </div>
      <div class="mb-6">
        <h3 class="text-xl font-bold">Content</h3>
        <p class="text-sm opacity-60 mb-2">Please enter the full content of your article.</p>
        <client-only>
          <QuillEditor v-model:content="article.content" contentType="html" theme="snow" toolbar="minimal" />
        </client-only>
      </div>
      <div class="flex justify-end mt-20 gap-8">
        <div class="bg-primary-gradient p-0.5 rounded-md">
          <Button @click="cancelEdit" class="bg-gray-300 hover:bg-gray-400 text-gray-800">Cancel</Button>
        </div>
        <div class="bg-primary-gradient p-0.5 rounded-md">
          <Button type="submit">Update Article</Button>
        </div>
      </div>
    </form>
    <div v-else class="text-center py-8">
      Loading article...
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

const articleId = route.params.id
const article = ref(null)

onMounted(async () => {
  try {
    article.value = await articleStore.fetchArticleById(articleId)
  } catch (error) {
    console.error('Error fetching article:', error)
  }
})

const onImageUploaded = (imageUrl) => {
  if (article.value) {
    article.value.image = imageUrl
  }
}

const updateArticle = async () => {
  try {
    await articleStore.updateArticle(articleId, article.value)
    router.push(`/articles/${articleId}`)
  } catch (error) {
    console.error('Error updating article:', error)
  }
}

const cancelEdit = () => {
  router.push(`/articles/${articleId}`)
}
</script>