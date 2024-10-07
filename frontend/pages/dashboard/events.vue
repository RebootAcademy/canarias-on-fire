<template>
  <div v-if="userStore.isAuthenticated && userRole === 'admin'">
    <div class="w-full flex flex-col-reverse md:flex-row items-center justify-between xs:gap-2 lg:px-4 mb-4">
      <div class="flex items-center justify-center text-sm md:text-base bg-gray rounded-lg border-1 border-gray md:p-2  ">
        <div 
            v-for="option in optionsFilters" 
            :key="option.label" 
            class="flex justify-start  cursor-pointer rounded-sm w-[80px] md:w-[100px] "
            :class="selectOption === option.value ? 'bg-black p-2  hover:bg-none' : 'hover:bg-zinc-800 p-2'"
            @click="selectOption = option.value"
          >
            <span class="text-center w-full " :class="selectOption === option.value ? 'font-bold text-white' : 'text-whiteGray'">{{ option.label }}</span>
          </div>
      </div>
      <!-- <div class="lg:hidden w-full md:w-1/3 mr-2">
        <CustomSelect :optionDefault="selectOption" :items="optionsFilters" @update:selected="handleSelection"/>
      </div> -->
      <div class="flex items-center justify-end gap-4 sm:w-1/2  lg:w-auto">
        
        <SearchInput v-model="searchQuery" />
        <CustomBtn
          :title="$t('filterBtn')"
          @click="openFilterModal"
        />
        <FilterModal />
      </div>
    </div>
    <hr class="mb-4" />
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
    >
      <EventCard
        v-for="event in adminEvents"
        :key="event._id"
        :event="event"
      />
    </div>
     <p v-if="adminEvents.length === 0" class="text-gray-500 mt-4">
       {{ $t('notEventsFound')}}
      </p>
  </div>

  <div v-if="userStore.isAuthenticated && userRole === 'company'">
    <div class="w-full flex flex-row  items-center justify-between xs:gap-2 lg:px-4 mb-4">
      <div class="xs:hidden lg:flex bg-gray rounded-lg border-1 border-gray p-2 ">
        <div 
            v-for="option in optionsFilters" 
            :key="option.label" 
            class="flex justify-start cursor-pointer rounded-sm w-[100px] p-2"
            :class="selectOption === option.value ? 'bg-black  hover:bg-none' : 'hover:bg-zinc-800'"
            @click="selectOption = option.value"
          >
            <span class="text-center w-full " :class="selectOption === option.value ? 'font-bold text-white' : 'text-whiteGray'">{{ option.label }}</span>
          </div>
      </div>
      <div class="lg:hidden w-1/3 mr-2">
        <CustomSelect :selectOption="selectOption" :optionsFilters="optionsFilters" @update:selected="handleSelection"/>
      </div>
      <div class="flex items-center justify-end gap-4 xs:w-2/3 sm:w-1/2  lg:w-auto">
        
        <SearchInput v-model="searchQuery" />
        <CustomBtn
          :title="$t('filterBtn')"
          @click="openFilterModal"
        />
        <FilterModal />
      </div>
    </div>
    <hr class="mb-4" />
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
    >
      <EventCard
        v-for="event in myEvents"
        :key="event._id"
        :event="event"
      />
    </div>
     <p v-if="myEvents.length === 0" class="text-gray-500 mt-4">
       {{ $t('notEventsFound')}}
      </p>
  </div>
</template>

<script setup>
import CustomSelect from '../../components/CustomSelect.vue'
const { t } = useI18n()
const eventStore = useEventStore()
const paymentStore = usePaymentStore()
const userStore = useUserStore()
const userRole = computed(() => userStore.userData?.role)
const selectOption = ref('all')

definePageMeta({
  layout: 'dashboard',
})

onMounted(() => {
  eventStore.resetFilters()
})

const searchQuery = computed({
  get: () => eventStore.searchQuery,
  set: (value) => eventStore.setSearchQuery(value)
})

const openFilterModal = () => {
  eventStore.setFilterModalOpen(true)
}

const optionsFilters = computed(() => {
  return [
    {label: t('eventsDashboard.all'), value: "all"},
    {label: t('eventsDashboard.draft'), value: "draft"},
    {label: t('eventsDashboard.published'), value: "published"},
    {label: t('eventsDashboard.closed'), value: "closed"}
  ]
})

const myEvents = computed(() => {
  let eventsType 
  if (selectOption.value !== 'all') {
    eventsType = eventStore.events.filter(event => event.status === selectOption.value)
  } else{
    eventsType = eventStore.events
  }

  return eventsType
    .filter(event => event.userId && event.userId?._id === userStore.userData._id && event.eventType === 'event')
    .sort((a, b) => {
      const priorityA = getEventPriority(a)
      const priorityB = getEventPriority(b)

      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }
      
      return compareDates(a.eventDate, b.eventDate)
    })
}) 

const adminEvents = computed(() => {
  return eventStore.events
    .filter((event) => event.eventType === 'event' && event.status === selectOption.value || selectOption.value === 'all')
    .sort((a, b) => {
      const priorityA = getEventPriority(a)
      const priorityB = getEventPriority(b)

      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }
      
      return compareDates(a.eventDate, b.eventDate)
    })
})
function getEventPriority(event) {
  const paymentId = event.type === 'event' ? event.payment._id : event.payment
  const payment = paymentStore.getPaymentById(paymentId?._id)
  return payment?.features?.readPriority
}

function compareDates(dateA, dateB) {
  if (!dateA || !dateB) {
    if (!dateA && !dateB) return 0
    return dateA ? -1 : 1
  }

  if (dateA.year !== dateB.year) return dateA.year - dateB.year;
  if (dateA.month !== dateB.month) return dateA.month - dateB.month;
  return dateA.day - dateB.day;
}


const handleSelection = (selectedValue) => {
 if (selectOption.value !== selectedValue) {
    selectOption.value = selectedValue;
  }
};
</script>
