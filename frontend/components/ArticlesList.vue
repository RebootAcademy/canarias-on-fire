<template>
  <div class="px-6 sm:px-10">
    <div class="overflow-x-auto ">
      <div class="flex space-x-8 pb-4">
        <ArticleCard 
          v-for="article in articles" 
          :key="article.id" 
          :article="article" 
          class="flex-shrink-0"
        />
      </div>
    </div>
    <p v-if="articles.length === 0" class="text-gray-500 h-60">{{ $t('notArticlesFound')}}</p>
  </div>
</template>

<script setup>
import { useEventStore } from '../../stores/eventStore.js'
import { useEventStore } from '~/stores/eventStore'

const eventStore = useEventStore()

const props = defineProps({
  articles: {
    type: Array,
    default: () => []
  }
})

/* const filteredEvents = computed(() => {
  const eventsToFilter = props.events.length > 0 ? props.events : eventStore.events
  if (!eventStore.selectedCategory) {
    return eventsToFilter
  }
  return eventsToFilter.filter(event => 
    event.categories.some(category => category.name === eventStore.selectedCategory)
  )
}) */

</script>

<style scoped>
.overflow-x-auto {
  scrollbar-width: thin; /* Firefox: barra de desplazamiento más delgada */
  scrollbar-color: #fbb03b #f7fafc; /* Color para Firefox: thumb y track */
}


</style>