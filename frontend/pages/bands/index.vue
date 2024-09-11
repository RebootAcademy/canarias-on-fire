<template>
    <div class=" px-8 py-4 sm:px-8 md:px-16 lg:px-40 mt-8 ">
        <div class="flex flex-row justify-between items-center">
            <h2 class="xs:text-xl sm:text-2xl md:text-4xl font-semibold text-primary mb-8">{{ $t('musicBands') }}</h2>
            <SearchInput v-model="searchQuery"/>
        </div>
        <div v-if="filteredBands.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-4 lg:gap-6">
            <BandCard v-for="band in filteredBands" :key="band._id" :band="band"/>
        </div>
       <!--  <div  v-if="bands && bands.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-4 lg:gap-4">
            <BandCard v-for="band in bands" :key="band._id" :band="band"/>
        </div> -->
        <div v-else-if="bands && bands.length === 0">
          <p>{{ $t('notFoundBands')}}</p>
        </div>
        <div v-else>
          <p>{{ $t('loadingBands')}}.</p>
        </div>
    </div>
</template>

<script setup>
const { data, error } = await useFetch(`${useRuntimeConfig().public.apiBaseUrl}/users/bands`)
const bands = ref([])
const searchQuery = ref('') // Inicialmente vacío

if (data.value) {
  bands.value = data.value.result || []
}
if (error.value) {
  console.error('Error fetching bands:', error.value)
}

const filteredBands = computed(() => {
  const search = searchQuery.value.trim().toLowerCase(); 
  
  if (!search) {
    return bands.value;
  }
  return bands.value.filter(band => {
    if (!band.bandName) return false; // Asegurar que 'bandName' existe
    return band.bandName.toLowerCase().includes(search); // Verificar coincidencia parcial
  });
});
</script>
