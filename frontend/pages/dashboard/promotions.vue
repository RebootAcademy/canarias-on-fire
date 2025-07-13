<template>
  <div class="flex flex-col gap-4 items-center bg-background">
    <div
      class="w-full flex flex-col-reverse md:flex-row items-center justify-between xs:gap-2 lg:px-4"
    >
      <div
        class="flex items-center justify-center text-sm md:text-base bg-gray rounded-lg border-1 border-gray md:p-2"
      >
        <div
          v-for="option in optionsFilters"
          :key="option.label"
          class="flex justify-start cursor-pointer rounded-sm w-[80px] md:w-[100px]"
          :class="
            selectOption === option.value
              ? 'bg-black p-2  hover:bg-none'
              : 'hover:bg-zinc-800 p-2'
          "
          @click="selectOption = option.value"
        >
          <span
            class="text-center w-full"
            :class="
              selectOption === option.value
                ? 'font-bold text-white'
                : 'text-whiteGray'
            "
            >{{ option.label }}</span
          >
        </div>
        <!--  <div class="flex gap-2 items-center">
          <CustomSelect
            :items="eventDiscounts"
            :placeholder="selectedPromotion"
            :optionDefault="selectedPromotion"
            v-model:selected="selectedPromotion"
          />
        </div> -->
      </div>
      <div class="flex items-center justify-end gap-4 sm:w-1/2 lg:w-auto">
        <SearchInput v-model="searchQuery" />
        <CustomBtn :title="$t('filterBtn')" @click="openFilterModal" />
      </div>
      <FilterModal type="promotion" />
    </div>
    <hr class="mb-4 border-1 border-black w-full" />
    <div
      v-if="
        limitedPromotions.filter((promotion) => promotion.status === 'closed')
          .length > 0
      "
      class="w-full flex justify-end mb-4 md:mb-0"
    >
      <Button
        class="bg-red-500 hover:bg-red-700 text-white"
        @click="tryToDelete = true"
      >
        {{ $t('buttons.deleteAll') }}
      </Button>
    </div>
    <div
      class="relative w-full h-full"
      :class="{
        ' grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4':
          !eventStore.isLoading,
      }"
    >
      <Spinner
        v-if="eventStore.isLoading"
        containerClasses="w-full h-full bg-background"
      />
      <PromotionCard
        v-else
        v-for="promotion in limitedPromotions"
        :key="promotion._id"
        :promotion="promotion"
      />
      <CustomModal v-model:open="tryToDelete">
        <ConfirmModalClosedEvent
          @close="tryToDelete = false"
          type="promotion"
          @update:open="tryToDelete = $event"
        />
      </CustomModal>
      <p v-if="limitedPromotions.length === 0" class="text-gray-500 mt-4">
        {{ $t('notEventsFound') }}
      </p>
    </div>
    <!--  <div v-if="userStore.isAuthenticated && userRole === 'company'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <PromotionCard
            v-for="promotion in limitedPromotions"
            :key="promotion._id"
            :promotion="promotion"
          />
          <p v-if="limitedPromotions.length === 0" class="text-gray-500 mt-4">
           {{ $t('notEventsFound')}}
          </p>
        </div> -->
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
const { t } = useI18n()
const userStore = useUserStore()
const eventStore = useEventStore()
const subscriptionStore = useSubscriptionStore()
const { filteredEvents } = storeToRefs(eventStore)
const userData = computed(() => userStore?.userData)
const tryToDelete = ref(false)

const userRole = computed(() => userStore?.userData?.role)

const selectOption = ref('all')
const optionsFilters = computed(() => {
  return [
    { label: t('eventsDashboard.all'), value: 'all' },
    { label: t('eventsDashboard.draft'), value: 'draft' },
    { label: t('eventsDashboard.published'), value: 'published' },
    { label: t('eventsDashboard.closed'), value: 'closed' },
  ]
})

const selectedPromotion = ref('all')
const eventDiscounts = computed(() => {
  return [
    { label: t('onBoarding.step2Genres.all'), value: 'all' },
    { label: t('eventTypeDiscount.2x1'), value: '2x1' },
    { label: t('eventTypeDiscount.3x1'), value: '3x1' },
    { label: t('eventTypeDiscount.3x2'), value: '3x2' },
    { label: t('eventTypeDiscount.5'), value: '5%' },
    { label: t('eventTypeDiscount.10'), value: '10%' },
    { label: t('eventTypeDiscount.15'), value: '15%' },
    { label: t('eventTypeDiscount.20'), value: '20%' },
    { label: t('eventTypeDiscount.25'), value: '25%' },
    { label: t('eventTypeDiscount.30'), value: '30%' },
    { label: t('eventTypeDiscount.35'), value: '35%' },
    { label: t('eventTypeDiscount.40'), value: '40%' },
    { label: t('eventTypeDiscount.45'), value: '45%' },
    { label: t('eventTypeDiscount.50'), value: '50%' },
    { label: t('eventTypeDiscount.55'), value: '55%' },
    { label: t('eventTypeDiscount.60'), value: '60%' },
    { label: t('eventTypeDiscount.65'), value: '65%' },
    { label: t('eventTypeDiscount.70'), value: '70%' },
    { label: t('eventTypeDiscount.free'), value: 'Gratis' },
    { label: t('eventTypeDiscount.other'), value: 'Otro' },
  ]
})

const searchQuery = computed({
  get: () => eventStore.searchQuery,
  set: (value) => eventStore.setSearchQuery(value),
})

const openFilterModal = () => {
  eventStore.setFilterModalOpen(true)
}

const limitedPromotions = computed(() => {
  let filterDiscount

  if (selectedPromotion.value === 'all') {
    filterDiscount = filteredEvents.value
  } else {
    filterDiscount = filteredEvents.value.filter(
      (event) => event.eventDiscount === selectedPromotion.value
    )
  }
  if (userRole.value === 'company') {
    filterDiscount = filterDiscount.filter(
      (event) => String(event.userId?._id) === String(userData.value?._id)
    )
    console.log(filterDiscount)
  }

  if (selectOption.value !== 'all') {
    filterDiscount = filterDiscount.filter(
      (event) => event.status === selectOption.value
    )
  }

  const filterSecond = filterDiscount
    .filter((event) => event.eventType === 'promotion')
    .sort((a, b) => {
      const priorityA = getPromoPriority(a)
      const priorityB = getPromoPriority(b)

      if (priorityA !== priorityB) {
        return priorityB - priorityA
      }
      return compareDates(a.eventDate, b.eventDate)
    })
  return filterSecond
})

function getPromoPriority(promotion) {
  const subscriptionName = promotion.subscription?.name

  let priority
  if (subscriptionName === 'optima') {
    priority = 2
  } else if (subscriptionName === 'basic') {
    priority = 1
  } else {
    priority = 0
  }
  return priority
}

function compareDates(dateA, dateB) {
  if (!dateA || !dateB) {
    if (!dateA && !dateB) return 0
    return dateA ? -1 : 1
  }
  if (dateA.year !== dateB.year) return dateA.year - dateB.year
  if (dateA.month !== dateB.month) return dateA.month - dateB.month
  return dateA.day - dateB.day
}

definePageMeta({
  layout: 'dashboard',
})

useHead({
  title: 'Promotions',
})

onMounted(async () => {
  await eventStore.fetchEvents()
})
</script>
