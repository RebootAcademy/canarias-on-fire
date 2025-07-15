<template>
  <div
    class="flex border-2 border-primary p-2 rounded-md flex justify-center items-center gap-4"
  >
    <span>{{ $t('buttonsEvents.events') }}</span>
  </div>

  <div class="mt-4">
    <CategoriesFilter type="event" />
    <div
      class="mt-4 w-full md:w-[200px] relative"
      role="combobox"
      :aria-expanded="open"
      aria-haspopup="listbox"
    >
      <button
        :key="selectedOption"
        type="button"
        class="relative border-2 rounded-md border-primary bg-transparent text-secondary bg-primary-gradient w-full flex items-center justify-center p-2 min-h-[2.5rem]"
        :class="open ? 'rounded-b-none' : 'rounded-b-md'"
        @click="toggleOpen"
      >
        <span class="text-[0.875rem] font-semibold">
          {{
            selectedOption
              ? options.find((opt) => opt.value === selectedOption)?.label
              : 'Selecciona un tipo'
          }}
        </span>
        <img
          src="/caret-abajo.png"
          alt="Caret Icon"
          class="absolute top-3 right-2 w-3 transition-transform duration-300"
          :class="{ 'rotate-180': open }"
        />
      </button>

      <ul
        v-show="open"
        class="transition-all duration-300 ease-out opacity-0 scale-y-95 origin-top absolute z-[100] w-full bg-black border border-primary border-t-0 rounded-b-md"
        :class="{
          'opacity-100 scale-y-100': open,
          'bg-white': theme === 'light',
        }"
        role="listbox"
      >
        <li
          v-for="option in options"
          :key="option.value"
          class="p-2 text-secondary hover:bg-primary-gradient cursor-pointer"
          @click="selectOption(option.value)"
          :aria-selected="selectedOption === option.value"
        >
          {{ option.label }}
        </li>
      </ul>
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

const selectedOption = ref('promotions')

const options = computed(() => [
  { label: t('buttonsEvents.promotions'), value: 'promotions' },

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

const open = ref(false)

const selectOption = (option) => {
  selectedOption.value = option
  open.value = false
}

const toggleOpen = () => {
  open.value = !open.value
}
</script>
