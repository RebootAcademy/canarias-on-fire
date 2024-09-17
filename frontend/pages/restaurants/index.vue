<template>
    <div class=" px-8 py-4 sm:px-8 md:px-16 lg:px-40 mt-8 ">
        <div class="flex flex-row justify-between items-center">
            <h2 class="xs:text-xl sm:text-2xl md:text-4xl font-semibold text-primary mb-8">{{ $t('title') }}</h2>
            <SearchInput v-model="searchQuery"/>
        </div>
        <div v-if="filteredRestaurants.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-4 lg:gap-6">
            <RestaurantCard v-for="restaurant in filteredRestaurants" :key="restaurant._id" :restaurant="restaurant"/>
        </div>
       <!--  <div  v-if="bands && bands.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-4 lg:gap-4">
            <RestaurantCard v-for="band in bands" :key="band._id" :band="band"/>
        </div> -->
        <div v-else-if="restaurants && restaurants.length === 0 || !filteredRestaurants.length">
          <p>{{ $t('notFound')}}</p>
        </div>
        <div v-else>
          <p>{{ $t('loading')}}.</p>
        </div>
    </div>
</template>

<script setup>
const { data, error } = await useFetch(`${useRuntimeConfig().public.apiBaseUrl}/users/restaurants`)
const restaurants = ref([])
const searchQuery = ref('') // Inicialmente vacío

if (data.value) {
  restaurants.value = data.value.result || []
}
if (error.value) {
  console.error('Error fetching restaurants:', error.value)
}

const filteredRestaurants = computed(() => {
  const search = searchQuery.value.trim().toLowerCase(); 
  
  if (!search) {
    return restaurants.value;
  }
  return restaurants.value.filter(restaurant => {
    if (!restaurant.companyName) return false; // Asegurar que 'bandName' existe
    return restaurant.companyName.toLowerCase().includes(search); // Verificar coincidencia parcial
  });
});
</script>
