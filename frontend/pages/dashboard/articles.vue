<template>
  <div>
    <div class="flex items-center justify-between w-full px-4 mb-4">
      <h2 class="text-xl font-semibold">Articles</h2>
      <div class="flex gap-4">
        <SearchInput v-model="searchQuery" />
        <Button @click="openFilterModal" class="text-sm px-3">
          {{ $t('filterBtn') }}
        </Button>
        <FilterModal />
      </div>
    </div>
    <hr class="mb-4" />
    <div class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      <ArticleCard
        v-for="article in filteredArticles"
        :key="article._id"
        :article="article"
      />
    </div>
    <p v-if="filteredArticles.length === 0" class="text-gray-500 mt-4">
      No se encontraron artículos.
    </p>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'

const articleStore = useArticleStore()
const { filteredArticles } = storeToRefs(articleStore)

definePageMeta({
  layout: 'dashboard',
})

onMounted(async () => {
  await  articleStore.fetchArticles()
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