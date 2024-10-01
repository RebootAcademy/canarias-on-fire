<template>
  <div class="w-full flex-col gap-2">
    <div class="w-full flex-row-reverse mb-4">
      <CustomSelect
        :items="genresItems"
        :placeholder="placeholderSelect"
        v-model:selected="selectedOption"
        :optionDefault="selectedOption"
        class="w-1/3"
      />
    </div>
    <div
      v-if="filteredBands.length"
      class="w-full grid justify-items-center items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 lg:gap-4"
    >
      <BandCard v-for="band in filteredBands" :key="band._id" :band="band" />
    </div>
    <div v-if="bandLength > 9" class="mt-6 w-full flex justify-center">
      <div class="w-1/3">
        <CustomBtn
          :title="t('buttons.seeMore')"
          :action="() => router.push('/events')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const userStore = useUserStore()
const { data, error } = await useFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/users/bands`
)
const { t } = useI18n()
const selectedOption = ref('all')
const bands = ref([])
const bandLength = ref('')

const genresItems = computed(() => {
  return [
    { value: 'all', label: t('onBoarding.step2Genres.all') },
    { value: 'djs', label: t('onBoarding.step2Genres.djs') },
    { value: 'latina', label: t('onBoarding.step2Genres.latina') },
    { value: 'electronic', label: t('onBoarding.step2Genres.electronic') },
    { value: 'rock', label: t('onBoarding.step2Genres.rock') },
    { value: 'jazz', label: t('onBoarding.step2Genres.jazz') },
    { value: 'classic', label: t('onBoarding.step2Genres.classic') },
    { value: 'other', label: t('onBoarding.step2Genres.other') },
  ]
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
    genreBands = bands.value
  } else {
    genreBands = bands.value.filter(
      (band) => band.genre === selectedOption.value
    )
  }
  bandLength.value = genreBands.length
  if (genreBands.length === 0) {
    return []
  } else {
    return sortBandsByNextPerformance(genreBands).slice(0, 9)
  }
})

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
