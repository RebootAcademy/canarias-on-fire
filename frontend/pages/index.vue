<template>
  <div class="h-full bg-gray-100">
    <div>
      <Hero />
      <EventsCounter :events="events"/>
      <CategoriesFilter />
      <EventsHeader />
      <EventList :events="events"/>
      <FeaturedEvents />
      <ArticlesHeader />
      <ArticlesList :articles="articles"/>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Canarias onFIRE - Eventos'
})

const { data, error } = await useFetch('http://localhost:8080/api/events', {
  lazy: false,
  server: false,
})

if (error.value) {
  console.error('Error fetching events:', error.value)
}

const events = computed(() => data.value?.result || [])
const articles = ref([
{
    id: 1,
    image: 'https://via.placeholder.com/400x200', // Reemplaza con la URL de tu imagen
    title: '10 essential items for your festivals',
    author: 'Canarias 7',
    authorImage: 'https://via.placeholder.com/50', // Reemplaza con la URL de la imagen del autor
    date: '2024-01-04'
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/400x200', // Reemplaza con la URL de tu imagen
    title: 'How to prepare for a music festival',
    author: 'Festival Guide',
    authorImage: 'https://via.placeholder.com/50', // Reemplaza con la URL de la imagen del autor
    date: '2024-02-15'
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/400x200', // Reemplaza con la URL de tu imagen
    title: 'How to prepare for a music festival',
    author: 'Festival Guide',
    authorImage: 'https://via.placeholder.com/50', // Reemplaza con la URL de la imagen del autor
    date: '2024-02-15'
  }
  // more articles...
])

</script>
