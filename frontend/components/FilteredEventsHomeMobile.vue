<template>
  <div class="flex flex-col justify-center gap-4">
    <CustomSelect 
    :items="options"
    :placeholder="selectedOption"
    v-model:selected="selectedOption"
    :optionDefault="selectedOption"
    />

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
const eventStore = useEventStore()

const eventCategories = computed(() => eventStore.eventCategories)

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
