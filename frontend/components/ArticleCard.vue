<template>
  <NuxtLink :to="`/articles/${article._id}`" class="block">
    <div class="bg-slate-900 text-background shadow-md rounded-md overflow-hidden w-auto min-w-[330px] max-w-[330px] min-h-[250px] max-h-[250px] flex flex-col">
      <img :src="article.coverImage" class="w-full h-40 object-cover" alt="Article Image" />
      <div class="p-4 flex flex-col justify-between flex-grow">
        <h3 class="text-xl font-semibold mb-2 line-clamp-2 text-white">{{ article.title }}</h3>
        <div class="mt-auto">
          <div class="flex items-center gap-2 mb-2">
            <Avatar v-if="article.authorImage" :src="article.authorImage" alt="Author Image" class="w-6 h-6 rounded-full" />
            <span class="text-sm text-white">{{ article.author }}</span>
          </div>
          <p class="text-sm text-white">{{ formattedDate(article.date) }}</p>
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

const formattedDate = (date) => {
  return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>