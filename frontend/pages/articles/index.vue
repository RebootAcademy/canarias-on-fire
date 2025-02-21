<template>
  <div class="flex flex-col items-center text-secondary">
    <Hero class="hidden sm:flex"/>
    <div class="w-full px-4 mt-8 md:mt-0">
      <div class="flex flex-col gap-2 md:flex-row md:gap-0 items-center justify-between w-full px-4 mb-8">
        <div class="flex w-full items-start">
          <h2 class="text-2xl lg:text-[38px] font-bold text-primary mb-4 md:mb-0">{{ $t('articles')}}</h2>
        </div>

        <div class="flex flex-row items-center  gap-4">
          <SearchInput v-model="searchQuery" />
          <!-- <div class="bg-primary-gradient p-0.5 rounded-md">
            <Button @click="openFilterModal" class="text-sm px-3 bg-background hover:text-white hover:bg-primary-gradient">
              {{ $t('filterBtn') }}
            </Button>
          </div> -->
          <FilterModal />
        </div>
      </div>
      <div class="grid justify-items-center gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:gap-4">
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