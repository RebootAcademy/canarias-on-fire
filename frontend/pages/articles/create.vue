<template>
  <div class="max-w-4xl mx-auto px-4 py-8 flex flex-col">
    <h1 class="text-3xl font-bold mb-6">Create New Article</h1>
    <form @submit.prevent="createArticle">
      <div>
        <h3 class="text-xl font-bold">Title</h3>
        <p class="text-sm opacity-60">Please enter the title of your article.</p>
        <Input id="title" v-model="article.title" required />
      </div>
      <div>
        <h3 class="text-xl font-bold">Content</h3>
        <p class="text-sm opacity-60">Please enter the title of your article.</p>
        <Textarea
          id="content"
          v-model="article.content"
          rows="6"
          class="w-full p-2 border rounded-md mb-2"
          required
        ></Textarea>
      </div>
      <div>
        <h3 class="text-xl font-bold">Image</h3>
        <p class="text-sm opacity-60">Please enter the full content of your article. Include all relevant details, supporting information, and any necessary context to fully convey your message to the readers.</p>
        <ImageUploader @image-uploaded="onImageUploaded" />
      </div>
      <div class="flex bg-red-200">
        <Button type="submit">Crear Artículo</Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const articleStore = useArticleStore()
const router = useRouter()

const article = ref({
  title: '',
  content: '',
  image: ''
})

const onImageUploaded = (imageUrl) => {
  article.value.image = imageUrl
}

const createArticle = async () => {
  try {
    await articleStore.createArticle(article.value)
    router.push('/dashboard/articles')
  } catch (error) {
    console.error('Error creating article:', error)
  }
}
</script>