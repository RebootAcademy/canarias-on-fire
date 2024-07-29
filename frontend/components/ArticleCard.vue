<template>
  <NuxtLink :to="`/articles/${article._id}`" class="block">
    <div class="bg-white shadow-md rounded-md overflow-hidden w-80 h-full flex flex-col">
      <NuxtImg :src="article.image" class="w-full h-40 object-cover" alt="Article Image" />
      <div class="p-4 flex flex-col justify-between flex-grow">
        <h3 class="text-xl font-semibold mb-2 line-clamp-2">{{ article.title }}</h3>
        <div class="mt-auto">
          <div class="flex items-center gap-2 mb-2">
            <Avatar :src="article.authorImage" alt="Author Image" class="w-6 h-6 rounded-full" />
            <span class="text-sm text-gray-600">{{ article.author }}</span>
          </div>
          <p class="text-sm text-gray-600">{{ formattedDate(article.date) }}</p>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

console.log('Article:', props.article)

const formattedDate = (date) => {
  return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>