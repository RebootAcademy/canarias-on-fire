<template>
  <div class="px-8 py-4 sm:px-8 md:px-16 lg:px-40 mt-8 text-secondary">
    <div class="flex flex-col md:flex-row justify-between items-center mb-8">
      <div class="flex w-full items-start">
        <h2
          class="text-2xl lg:text-[38px] font-bold text-primary "
        >
          {{ $t('title') }}
        </h2>
      </div>

      <div class="flex flex-row mb-4 gap-4 md:mb-0 w-full md:w-2/3 lg:w-2/5">
        <CustomSelect
          :placeholder="placeholderSelect"
          v-model:selected="foodSelected"
          :items="restorationSectors"
          :optionDefault="foodSelected"
          class="w-1/3"
        />
        <SearchInput v-model="searchQuery" class="w-2/3" />
      </div>
    </div>
    <div
      v-if="filteredRestaurants.length"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-4 lg:gap-6"
    >
      <RestaurantCard
        v-for="restaurant in filteredRestaurants"
        :key="restaurant._id"
        :restaurant="restaurant"
      />
    </div>
    <!--  <div  v-if="bands && bands.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 sm:gap-4 lg:gap-4">
            <RestaurantCard v-for="band in bands" :key="band._id" :band="band"/>
        </div> -->
    <div
      v-else-if="
        (restaurants && restaurants.length === 0) || !filteredRestaurants.length
      "
    >
      <p>{{ $t('notFound') }}</p>
    </div>
    <div v-else>
      <p>{{ $t('loading') }}.</p>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const { data, error } = await useFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/users/restaurants`
)
const restaurants = ref([])
const searchQuery = ref('')
const foodSelected = ref('all')

const restorationSectors = computed(() => {
  return [
    { value: 'all', label: t('onBoarding.step2Genres.all') },
    { value: 'family', label: t('onBoarding.foodType.family') },
    { value: 'spanish', label: t('onBoarding.foodType.spanish') },
    { value: 'italian', label: t('onBoarding.foodType.italian') },
    { value: 'mexican', label: t('onBoarding.foodType.mexican') },
    { value: 'asian', label: t('onBoarding.foodType.asian') },
    { value: 'vegan', label: t('onBoarding.foodType.vegan') },
    { value: 'vegetarian', label: t('onBoarding.foodType.vegetarian') },
    { value: 'fastfood', label: t('onBoarding.foodType.fastfood') },
    { value: 'tapas', label: t('onBoarding.foodType.tapas') },
    { value: 'other', label: t('onBoarding.foodType.other') },
  ]
})

const placeholderSelect = computed(() => {
  return t('onBoarding.step2Sector.placeholder')
})

if (data.value) {
  restaurants.value = data.value.result.filter((restaurant) => restaurant.sector === 'restoration') || []
}
if (error.value) {
  console.error('Error fetching restaurants:', error.value)
}

const filteredRestaurants = computed(() => {
  let foodRestaurants
  if (foodSelected.value === 'all') {
    foodRestaurants = restaurants.value
  } else {
    foodRestaurants = restaurants.value.filter(
      (restaurant) => restaurant.type === foodSelected.value
    )
  }
  const search = searchQuery.value.trim().toLowerCase()

  if (!search) {
    return foodRestaurants
  }
  return foodRestaurants.filter((restaurant) => {
    if (!restaurant.companyName) return false
    return restaurant.companyName.toLowerCase().includes(search)
  })
})
</script>
