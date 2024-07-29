<template>
  <div v-if="article" class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-4">{{ article.title }}</h1>
    <div class="flex items-center mb-4">
      <Avatar :src="article.userId?.avatar" alt="Author Image" class="w-10 h-10 rounded-full mr-4" />
      <div>
        <p class="font-semibold">{{ article.userId?.name }}</p>
        <p class="text-sm text-gray-600">{{ formattedDate(article.date) }}</p>
      </div>
    </div>
    <NuxtImg :src="article.image" class="w-full h-64 object-cover mb-6 rounded-lg" />
    <div class="prose max-w-none" v-html="article.content"></div>
<!--     <div v-if="article.categories.length" class="mt-6">
      <h3 class="text-xl font-semibold mb-2">Categories:</h3>
      <ul class="flex flex-wrap gap-2">
        <li v-for="category in article.categories" :key="category._id" class="bg-gray-200 px-3 py-1 rounded-full text-sm">
          {{ category.name }}
        </li>
      </ul>
    </div> -->
    <div v-if="article.relatedEvents" class="mt-6">
      <h3 class="text-xl font-semibold mb-2">Related Event:</h3>
      <p>{{ article.relatedEvents.name }}</p>
    </div>
  </div>
  <div v-else class="text-center py-8">
    Loading article...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleStore } from '~/stores/articleStore'

const route = useRoute()
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

const formattedDate = (date) => {
  return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>