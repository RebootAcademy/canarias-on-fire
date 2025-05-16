<template>
  <div class="flex flex-wrap justify-center gap-4">
    <div
      v-for="item in options"
      :key="item.value"
      
      class="flex text-xs md:text-lg items-center text-center min-w-40 max-w-full md:max-w-64 md:min-h-24 justify-center bg-gray rounded-lg cursor-pointer hover:bg-primary hover:text-background "
      
      @click="selectedOption = item.value"
      :class="{
        'bg-transparent border-2 border-primary font-bold': selectedOption === item.value,
      }"
    >
      <img class="object-cover" :src="item.image" :alt="item.label"/>
    </div>
  </div>

  <div v-if="selectedOption === 'events'" class="mt-4">
    <CategoriesFilter type="event" />
    <EventsHeader />
    <EventList/>
  </div>
  <div v-if="selectedOption === 'kids'" class="mt-4">
    <EventsHeader />
    <EventList type="kids"/>
  </div>
  <div
    v-if="
      selectedOption === 'nightlife' ||
      selectedOption === 'food&drinks' ||
      selectedOption === 'activities' ||
      selectedOption === 'plans' 
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

const selectedOption = ref('events')

const options = computed(() => [
  { label: t('buttonsEvents.events'), value: 'events' , image: "/boton_eventos.png"},
  { label: t('buttonsEvents.nightlifePromotion'), value: 'nightlife', image: "/boton_nocturno.png" },
  { label: t('buttonsEvents.food&DrinksPromotion'), value: 'food&drinks', image: "/boton_bares.png" },
  { label: t('buttonsEvents.kidsPromotion'), value: 'kids', image:"/boton_peques 2.png" },
  { label: t('buttonsEvents.activitiesPromotion'), value: 'activities', image: "/boton_actividades.png" },
  { label: t('buttonsEvents.plansPromotion'), value: 'plans', image: "/boton_escapada.png" },
  { label: t('buttonsEvents.planYourParty'), value: 'createEvent', image: "/boton_fiesta.png" },
])
</script>
