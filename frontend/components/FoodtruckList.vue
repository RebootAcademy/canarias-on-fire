<template>
  <div class="w-full flex-col gap-2">
    <div class="w-full flex-row-reverse mb-4"></div>
    <div
      v-if="foodtrucks.length"
      class="w-full grid justify-items-center items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 lg:gap-4"
    >
      <RestaurantCard
        v-for="foodstruck in foodtrucks"
        :key="foodstruck._id"
        :restaurant="foodstruck"
      />
    </div>
    <div v-else>
        <p>{{ $t('foodtruckSection.noFoodtruck') }}</p>
    </div>
  </div>
</template>

<script setup>
const t = useI18n()
const searchQuery = ref('')
const foodtrucks = ref([])
const { data, error } = await useFetch(
  `${useRuntimeConfig().public.apiBaseUrl}/users/restaurants`
)

if (error.value) {
  console.error(error.value)
}

if (data.value) {
  console.log(data.value)
  foodtrucks.value =
    data.value.result.filter(
      (foodstruck) => foodstruck.sector === 'foodtruck'
    ) || []
  console.log(foodtrucks.value)
}

const filteredFoodtrucks = computed(() => {
  let foodStrucksFromDB = foodtrucks.value

  const search = searchQuery.value.trim().toLowerCase()

  if (!search) {
    return foodStrucksFromDB
  }
  return foodStrucksFromDB.filter((foodstruck) => {
    if (!foodstruck.companyName) return false
    return foodstruck.companyName.toLowerCase().includes(search)
  })
})
</script>
