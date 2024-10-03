<template>
  <div class="h-full bg-background text-secondary w-full !flex !flex-col gap-2 items-center">
    <img src="/public/logo_color.png" alt="Evente Logo" class="min-w-[100px] max-w-[150px] mt-8 mb-10 sm:hidden" />
    <Hero class="hidden sm:flex"/>
    <div class="w-full flex flex-col items-center h-fit">
      <div class="flex flex-col gap-2 px-4 w-full sm:px-0 sm:w-3/4 md:w-3/4 lg:w-2/3">
        <EventsCounter />
        <!-- <CategoriesFilter :isEvents="true"/>
        <EventsHeader /> 
        <EventList />-->
        <FilteredEventsHome />
      </div>
      <Explore />
      <!-- <div class="w-full flex flex-col gap-4 sm:w-3/4 md:w-3/4 lg:w-2/3">
        <h2 class="text-3xl font-semibold text-primary my-6">{{ $t('promotionsTitle') }}</h2>
        <CategoriesFilter />
        <PromotionList />
      </div> -->
      <div class="flex flex-col gap-2 w-full sm:w-3/4 md:w-3/4 lg:w-2/3">
        <FeaturedEvents class="hidden sm:block"/>
        <ScrollXSFeaturedEvents class="block sm:hidden"/>
        <ArticlesHeader />
        <ArticlesList :articles="articleStore.articles"/>
      </div>
      <SubscribeNewsletter />
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Evente - Home'
})

const eventStore = useEventStore()
const userStore = useUserStore()
const articleStore = useArticleStore()
import { useRuntimeConfig } from '#app'




const users = ref([])

async function fetchUsers() {
  try {
    const config = useRuntimeConfig()
    const response = await fetch(`${config.public.apiBaseUrl}/users`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data && data.result) {
      users.value = data.result
      userStore.users = data.result
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

onMounted(() => {
  fetchUsers()
  eventStore.resetFilters()
})

</script>
