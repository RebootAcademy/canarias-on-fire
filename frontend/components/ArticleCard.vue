<template>
  <div class="w-96 h-80 bg-white shadow-md rounded-md">
    <NuxtImg :src="article.image" class="w-full h-40 object-cover" />
    <div class="p-4 flex flex-col justify-between">
      <h3 class="text-xl font-semibold">{{ article.title }}</h3>
      <div class="flex items-center gap-2 mt-2">
        <Avatar :src="article.authorImage" alt="Author Image" class="w-6 h-6 rounded-full" />
        <span class="text-sm text-gray-600">{{ article.author }}</span>
      </div>
      <p class="text-sm text-gray-600">{{ formattedDate(article.date) }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

const formattedDate = (date) => {
  return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
