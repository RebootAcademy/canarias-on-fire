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
  <MusicFilterModal :openModal="openModal"   @close="openModal = false"/>
</template>

<script setup>
const { t } = useI18n()
import { storeToRefs } from 'pinia'
import * as LucideIcons from 'lucide-vue-next'
const openModal = ref(false)
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
const eventStore = useEventStore()
const {
  categories,
  selectedCategories,
  selectedCategoriesForPromotion,
  selectCategoryForFilterCompany,
} = storeToRefs(eventStore)

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

const isMusicSelected = () => {
  return selectedCategories.value.some((c) => c.name === 'music')
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


</script>

<style scoped>
@media (hover: hover) {
  .genre-item:hover {
    @apply bg-primary-gradient;
  }
}
</style>
