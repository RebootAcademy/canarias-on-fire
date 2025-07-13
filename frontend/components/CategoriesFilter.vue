<template>
  <div class="flex justify-center flex-wrap items-center gap-2.5">
    <div
      v-for="category in displayCategories"
      :key="category.id"
      class="flex flex-col items-center cursor-pointer p-2.5 rounded-lg transition-colors duration-300"
      :class="{ 'text-primary': isSelected(category) }"
      @click="handleCategoryClick(category)"
    >
      <div
        class="ring-1 p-3 md:p-6 rounded-full ring-gray mb-2 hover:bg-gray"
        :class="{ 'ring-[rgb(247,145,29)]': isSelected(category) }"
      >
        <component
          :is="getIcon(category.icon)"
          class="w-6 h-6 lg:w-10 lg:h-10"
        />
      </div>
      <span class="mt-1.5 text-xs text-secondary font-bold">{{
        $t(`values.${category.name}`)
      }}</span>
    </div>
  </div>

  <!-- Overlay -->
  <div
    v-if="openModal"
    @click="closeModal"
    class="fixed inset-0 bg-black bg-opacity-50 z-[60]"
  ></div>

  <!-- Modal -->
  <div
    v-if="openModal"
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[70vh] md:h-[50vh] md:w-[80vw] xl:w-[50vw] bg-white bg-opacity-30 z-[70] rounded-sm text-black"
    :class="[
      theme === 'dark' ? 'bg-white bg-opacity-30' : 'bg-white bg-opacity-30 ',
    ]"
  >
    <div
      class="relative grid grid-cols-1 md:grid-rows-2 gap-y-1 md:gap-4 p-4 md:grid-cols-4 h-full"
    >
      <div
        v-for="genre in genresItems"
        :key="genre.value"
        class="border flex items-center justify-center text-center text-black cursor-pointer rounded-sm bg-white bg-opacity-90 genre-item"
        :class="[
          theme === 'dark' ? 'border-primary' : '',
          eventStore.selectedGenres.includes(genre.value)
            ? 'bg-primary-gradient text-white'
            : '',
        ]"
        @click="
          () => {
            eventStore.toggleGenre(genre.value)
            if (genre.value === 'all') {
              closeModal()
            }
          }
        "
      >
        <span class="p-2">{{ $t(genre.label) }}</span>
      </div>
    </div>
    <div class="flex gap-x-2">
      <button
        @click="closeModal"
        class="border w-[12rem] rounded-sm bg-primary-gradient flex items-center justify-center text-center cursor-pointer mt-2 w-full h-12"
      >
        aplicar
      </button>
      <button
        @click="
          () => {
            eventStore.clearGnre()
          }
        "
        class="border w-[12rem] rounded-sm bg-primary-gradient flex items-center justify-center text-center cursor-pointer mt-2 w-full h-12"
      >
        Limpiar filtro
      </button>
    </div>
    <div
      @click="
        () => {
          eventStore.clearGnre()
          closeModal()
        }
      "
      class="absolute w-6 h-6 bg-primary top-[-12px] right-[-12px] flex justify-center items-center rounded-sm cursor-pointer opacity-90"
    >
      <span class="font-bold opacity-60 text-background">X</span>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
import { storeToRefs } from 'pinia'
import * as LucideIcons from 'lucide-vue-next'

const props = defineProps({
  type: {
    type: String,
    required: true,
    default: 'event',
  },
  isCompany: {
    type: Boolean,
    default: false,
    // This is only for filter companies in Plan your party
  },
})
const userStore = useUserStore()
const eventStore = useEventStore()
const {
  categories,
  selectedCategories,
  selectedCategoriesForPromotion,
  selectCategoryForFilterCompany,
} = storeToRefs(eventStore)

const theme = computed(() => userStore?.themePreference)
const selectedOption = ref('all')

watch(selectedOption, (value) => (eventStore.musicFilter = value))

const filterCategories = computed(() => {
  if (props.type === 'event') {
    return categories.value.filter((category) => category.type !== 'promotion')
  } else {
    return categories.value
  }
})

const displayCategories = computed(() => {
  if (!eventStore.categories) return []
  return filterCategories.value.filter((cat) => cat.type === props.type)
})

const getIcon = (iconName) => {
  return LucideIcons[iconName] || LucideIcons.HelpCircle
}

const isSelected = (category) => {
  if (category.name === 'music') {
    return eventStore.selectedGenres.length > 0
  }
  if (props.type === 'event') {
    return selectedCategories.value.some(
      (c) => c.id === category.id && c.type !== 'promotions'
    )
  } else if (selectCategoryForFilterCompany.value && props.isCompany === true) {
    return selectCategoryForFilterCompany.value?.id === category?.id
  } else {
    return selectedCategoriesForPromotion.value.some(
      (c) => c.id === category.id && c.type === 'promotions'
    )
  }
}

const handleCategoryClick = (category) => {
  if (isMusicSelected()) {
    selectedOption.value = 'all'
  }
  if (props.type === 'event') {
    eventStore.toggleCategory(category)
  } else if (props.isCompany === true) {
    eventStore.setTypeOfCompanyCategory(category)
  } else {
    eventStore.toogleCategoryForPromotions(category)
  }
  if (category.name === 'music') {
    openModal.value = true
  }
}

const genresItems = computed(() => {
  return [
    { value: 'all', label: t('onBoarding.step2Genres.all') },
    { value: 'djs', label: t('onBoarding.step2Genres.djs') },
    { value: 'latina', label: t('onBoarding.step2Genres.latina') },
    { value: 'folklore', label: t('onBoarding.step2Genres.folklore') },
    { value: 'rock', label: t('onBoarding.step2Genres.rock') },
    { value: 'jazz', label: t('onBoarding.step2Genres.jazz') },
    { value: 'classic', label: t('onBoarding.step2Genres.classic') },
    { value: 'other', label: t('onBoarding.step2Genres.other') },
  ]
})

const placeholderSelect = computed(() => {
  return t('onBoarding.step2SelectGenres')
})
const openModal = ref(false)
const isMusicSelected = () => {
  return selectedCategories.value.some((c) => c.name === 'music')
}

const closeModal = () => {
  openModal.value = false

  const musicCategory = selectedCategories.value.find((c) => c.name === 'music')

  if (musicCategory && eventStore.selectedGenres.length === 0) {
    eventStore.toggleCategory(musicCategory)
  }
}
</script>

<style scoped>
@media (hover: hover) {
  .genre-item:hover {
    @apply bg-primary-gradient;
  }
}
</style>
