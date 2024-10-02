<template>
  <div class="flex flex-wrap justify-center gap-4">
    <div
      v-for="item in options"
      :key="item.value"
      class="flex text-xs md:text-md items-center text-center min-w-40 max-w-full md:max-w-64 md:min-h-16 justify-center bg-gray rounded-lg px-4 py-2 cursor-pointer hover:bg-primary hover:text-background"
      @click="selectedOption = item.value"
      :class="{
        'bg-transparent border-2 border-primary': selectedOption === item.value,
      }"
    >
      <p>{{ item.label }}</p>
    </div>
  </div>

  <div v-if="selectedOption === 'events'" class="mt-4">
    <CategoriesFilter type="event" />
    <EventsHeader />
    <EventList />
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
</template>

<script setup>
const { t } = useI18n()

const selectedOption = ref('events')

const options = computed(() => [
  { label: t('buttonsEvents.events'), value: 'events' },
  { label: t('buttonsEvents.nightlifePromotion'), value: 'nightlife' },
  {
    label: t('buttonsEvents.food&DrinksPromotion'),
    value: 'food&drinks',
  },
  { label: t('buttonsEvents.kidsPromotion'), value: 'kids' },
  { label: t('buttonsEvents.activitiesPromotion'), value: 'activities' },
  { label: t('buttonsEvents.plansPromotion'), value: 'plans' },
  { label: t('buttonsEvents.planYourParty'), value: 'createEvent' },
])
</script>
