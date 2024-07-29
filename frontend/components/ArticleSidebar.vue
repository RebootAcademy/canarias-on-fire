<template>
  <div class="w-80 p-10">
    <h3 class="text-xl font-semibold mb-4">More Articles</h3>
    <ul>
      <li v-for="article in articles" :key="article._id" class="mb-4">
        <NuxtLink :to="`/articles/${article._id}`" class="flex items-start">
          <img :src="article.image" alt="Article Image" class="w-16 h-16 object-cover mr-4 rounded-md" />
          <div>
            <h4 class="text-sm font-semibold">{{ article.title }}</h4>
            <p class="text-xs text-gray-600">{{ formattedDate(article.date) }}</p>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  articles: {
    type: Array,
    required: true
  }
})

const formattedDate = (date) => {
  return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.sidebar {
  width: 300px;
}
</style>