<template>
  <div class="flex flex-col items-center text-secondary">
    <Hero />
    <div class="md:w-3/4 lg:w-2/3">
      <div class="flex items-center justify-between w-full px-4 mb-4">
        <h2 class="text-xl font-semibold">{{ $t('articles')}}</h2>
        <div class="flex gap-4">
          <SearchInput v-model="searchQuery" />
          <div class="bg-primary-gradient p-0.5 rounded-md">
            <Button @click="openFilterModal" class="text-sm px-3 bg-gray hover:text-white hover:bg-primary-gradient">
              {{ $t('filterBtn') }}
            </Button>
          </div>
          <FilterModal />
        </div>
      </div>
      <hr class="mb-4" />
      <div class="grid grid-cols-1 justify-items-center sm:grid-cols-1 md:justify-items-start lg:grid-cols-3 gap-4 p-4">
        <ArticleCard
          v-for="article in filteredArticles"
          :key="article._id"
          :article="article"
        />
      </div>
      <p v-if="filteredArticles.length === 0" class="text-gray-500 mt-4">
        {{ $t('notArticlesFound') }}
      </p>

    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'

const articleStore = useArticleStore()
const { filteredArticles } = storeToRefs(articleStore)

/* definePageMeta({
  layout: 'dashboard',
}) */

onMounted(async () => {
  await articleStore.fetchArticles()
  articleStore.resetFilters()
})

const searchQuery = computed({
  get: () => articleStore.searchQuery,
  set: (value) => articleStore.setSearchQuery(value)
})

const openFilterModal = () => {
  articleStore.setFilterModalOpen(true)
}

</script>