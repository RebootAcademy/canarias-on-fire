<template>
  <div class="px-10">
    <div class="overflow-x-auto">
      <div class="flex space-x-8 pb-4">
        <ArticleCard 
          v-for="article in articles" 
          :key="article.id" 
          :article="article" 
          class="flex-shrink-0"
        />
      </div>
    </div>
    <p v-if="articles.length === 0" class="text-gray-500 h-60">No se encontraron artículos.</p>
  </div>
</template>

<script setup>
import { useEventStore } from '../../stores/eventStore'

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
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}
</style>