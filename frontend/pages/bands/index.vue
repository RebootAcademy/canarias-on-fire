<template>
    <div class=" px-8 py-4 sm:px-8 md:px-16 lg:px-40 mt-8 ">
        <div class="flex flex-col md:flex-row justify-between items-center">
            <h2 class="xs:text-xl sm:text-2xl md:text-4xl font-semibold text-primary mb-8">
              {{ $t('musicBands') }}
            </h2>
            <div class="flex flex-row mb-4 gap-4 md:mb-0 w-full md:w-2/3 lg:w-1/3">
              <CustomSelect 
                :items="genresItems" 
                :placeholder="placeholderSelect" 
                v-model:selected="selectedOption"
                :optionDefault="selectedOption"
                class="w-1/3"
              />
              <SearchInput v-model="searchQuery" class="w-2/3"/>
            </div>
        </div>
        <div v-if="filteredBands.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-4 lg:gap-6">
            <BandCard v-for="band in filteredBands" :key="band._id" :band="band"/>
        </div>
       <!--  <div  v-if="bands && bands.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-4 lg:gap-4">
            <BandCard v-for="band in bands" :key="band._id" :band="band"/>
        </div> -->
        <div v-else-if="bands && filteredBands.length === 0">
          <p>{{ $t('notFoundBands')}}</p>
        </div>
        <div v-else>
          <p>{{ $t('loadingBands')}}.</p>
        </div>
    </div>
</template>

<script setup>
const { data, error } = await useFetch(`${useRuntimeConfig().public.apiBaseUrl}/users/bands`)
const {t} = useI18n()
const bands = ref([])
const searchQuery = ref('') // Inicialmente vacío
const selectedOption = ref('all')
const genresItems = computed( () => {
  return [
  {value: 'all', label: t('onBoarding.step2Genres.all')},
  {value: 'djs', label: t('onBoarding.step2Genres.djs')},
  {value: 'latina', label: t('onBoarding.step2Genres.latina')},
  {value: 'electronic', label: t('onBoarding.step2Genres.electronic')},
  {value: 'rock', label: t('onBoarding.step2Genres.rock')},
  {value: 'jazz', label: t('onBoarding.step2Genres.jazz')},
  {value: 'classic', label: t('onBoarding.step2Genres.classic')},
  {value: 'other', label: t('onBoarding.step2Genres.other')}
]});

const placeholderSelect = computed(() => {
  return t('onBoarding.step2SelectGenres')
})

if (data.value) {
  bands.value = data.value.result || []
}
if (error.value) {
  console.error('Error fetching bands:', error.value)
}

const filteredBands = computed(() => {
  let genreBands 
  if (selectedOption.value === 'all') {
    genreBands = bands.value;
  } else {
    genreBands = bands.value.filter(band => band.genre === selectedOption.value);
  }

  const search = searchQuery.value.trim().toLowerCase(); 
  genreBands = sortBandsByNextPerformance(genreBands);
  if (!search) {
    return genreBands;
  }
  return genreBands.filter(band => {
    if (!band.bandName) return false; // Asegurar que 'bandName' existe
    return band.bandName.toLowerCase().includes(search); // Verificar coincidencia parcial
  });
});

function sortBandsByNextPerformance(bands) {
  return bands.sort((a, b) => {
    const hasValidNextPerformanceA = isValidNextPerformance(a.nextPerformance)
      ? 1
      : 0
    const hasValidNextPerformanceB = isValidNextPerformance(b.nextPerformance)
      ? 1
      : 0

    if (hasValidNextPerformanceA !== hasValidNextPerformanceB) {
      return hasValidNextPerformanceB - hasValidNextPerformanceA
    }

    if (hasValidNextPerformanceA && hasValidNextPerformanceB) {
      const dateA = new Date(
        a.nextPerformance.date.year,
        a.nextPerformance.date.month - 1,
        a.nextPerformance.date.day
      )
      const dateB = new Date(
        b.nextPerformance.date.year,
        b.nextPerformance.date.month - 1,
        b.nextPerformance.date.day
      )

      return dateA - dateB
    }
    return 0
  })
}

function isValidNextPerformance(nextPerformance) {
  if (!nextPerformance) return false
  const hasValidLocation =
    nextPerformance.location && nextPerformance.location !== ''
  const hasValidDate =
    nextPerformance.date &&
    nextPerformance.date.year &&
    nextPerformance.date.month &&
    nextPerformance.date.day
  return hasValidLocation && hasValidDate
}
</script>
