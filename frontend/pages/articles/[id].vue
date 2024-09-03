<template>
  <div class="flex max-w-6xl mx-auto px-4 py-8 bg-black">
    <div class="flex-grow">
      <div v-if="article" class="max-w-4xl">
        <h1 class="text-3xl font-bold mb-4">{{ article.title }}</h1>
        <div class="flex items-center mb-4">
          <Avatar :src="article.userId?.avatar" alt="Author Image" class="w-10 h-10 rounded-full mr-4" />
          <div>
            <p class="font-semibold">{{ article.userId?.name }}</p>
            <p class="text-sm text-gray-600">{{ formattedDate(article.date) }}</p>
          </div>
        </div>
        <NuxtImg :src="article.coverImage" class="w-full h-64 object-cover mb-6 rounded-lg" alt="Article Image" />
        <div class="prose max-w-none" v-html="article.content"></div>
        <ArticleGallery />
      </div>
      <div v-else class="text-center py-8">
        Loading article...
      </div>
      <div class="flex gap-2 mt-6 mb-6">
      <Button class="px-4">
        <Share2 class="mr-2 h-4 w-4" />
        Share
      </Button>
      <Button 
        v-if="userStore.userData.role === 'admin'"
        @click="editArticle"
      >
        <Pencil class="mr-2 h-4 w-4" />
        Edit
      </Button>
      <Button 
        v-if="userStore.userData.role === 'admin'" 
        @click="deleteArticle"
      >
        <Trash class="mr-2 h-4 w-4" />
        Delete
      </Button>
    </div>
    </div>
    <ArticleSidebar :articles="otherArticles" />
  </div>
</template>

<script setup>
import { Share2, Pencil, Trash } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
const userStore = useUserStore()

const { article } = storeToRefs(articleStore)

const articleId = route.params.id

onMounted(async () => article.value = await articleStore.fetchArticleById(articleId))

const otherArticles = computed(() => {
  return articleStore.articles.filter(a => a._id !== articleId)
})

const formattedDate = (date) => {
  return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

const editArticle = () => {
  router.push(`/articles/edit/${articleId}`)
}

const deleteArticle = async () => {
  const result = await articleStore.deleteArticle(articleId)
    if (result.success) {
      console.log(result.message)
      await articleStore.fetchArticles() 
      router.push('/')
    } else {
      console.error(result.message)
    }
}

</script>