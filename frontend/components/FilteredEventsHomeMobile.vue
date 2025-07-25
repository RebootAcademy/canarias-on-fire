<template>
  <div
    class="flex border-2 border-primary p-2 rounded-md flex justify-center items-center gap-4"
  >
    <span>{{ $t('buttonsEvents.events') }}</span>
  </div>

  <div class="mt-4">
    <CategoriesFilter type="event" />
    <div class="mt-4 w-full md:w-[200px] relative">
      <button
        :key="selectedOption"
        type="button"
        class="relative border-2 rounded-md border-primary bg-transparent text-secondary bg-primary-gradient w-full flex items-center justify-center p-2 min-h-[2.5rem]"
        :class="open ? 'rounded-b-none' : 'rounded-b-md'"
        @click="toggleOpen"
      >
        <span class="text-[0.875rem] font-semibold">
          {{ selectedLabel }}
        </span>
      </button>
      <FilterPromotionModal
        :openModal="open"
        @close="open = false"
        @select="selectOption"
        :options="options"
      />
    </div>
    <div
      v-if="
        selectedOption === 'nightlife' ||
        selectedOption === 'food&drinks' ||
        selectedOption === 'activities' ||
        selectedOption === 'plans' ||
        selectedOption === 'kids'
      "
      class="mt-4"
    >
      <PromotionList :filteredOption="selectedOption" />
    </div>
    <div v-if="selectedOption === 'createEvent'" class="mt-4">
      <CategoriesPlanYourParty />
      <PlanYourParty />
    </div>
    <EventsHeader />
    <EventList />
  </div>
</template>

<script setup>
const { t } = useI18n()
const eventStore = useEventStore()
const userStore = useUserStore()
const theme = computed(() => userStore.themePreference)
const eventCategories = computed(() => eventStore.eventCategories)
const selectedLabel = computed(() => {
  return (
    options.value.find((opt) => opt.value === selectedOption.value)?.label ||
    'Promociones'
  )
})
const selectedOption = ref('promotions')

const open = ref(false)

const selectOption = (option) => {
  selectedOption.value = option
  open.value = false
}

const toggleOpen = () => {
  open.value = !open.value
}

const options = computed(() => [
  { label: t('buttonsEvents.promotions'), value: 'promotions' },
  {
    label: t('buttonsEvents.food&DrinksPromotion'),
    value: 'food&drinks', image: '/boton_bares.png'
  },
  { label: t('buttonsEvents.activitiesPromotion'), value: 'activities', image: "/boton_actividades.png"  },
  { label: t('buttonsEvents.plansPromotion'), value: 'plans', image: "/boton_escapada.png" },
   { label: t('buttonsEvents.nightlifePromotion'), value: 'nightlife', image: "/boton_nocturno.png" },
])
</script>
