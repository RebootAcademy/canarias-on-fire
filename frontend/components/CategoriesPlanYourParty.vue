<template>
  <div class="grid  grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap lg:justify-center items-place-center gap-2.5">
    <div
      v-for="(category, index) in optionsFilter"
      :key="index"
      class="flex flex-col justify-center items-center text-center cursor-pointer p-1.5 sm:p-2.5 rounded-lg transition-colors duration-300"
      :class="{ 'text-primary': isSelected(category) }"
      @click="toggleCategory(category)"
    >
      <div
        class="ring-1 p-3 md:p-4 rounded-full ring-gray mb-2 hover:bg-gray"
        :class="{ 'ring-[rgb(247,145,29)]': isSelected(category) }"
      >
        <component
          :is="getIcon(category.icon)"
          class="w-6 h-6 lg:w-10 lg:h-10"
        />
      </div>
      <span class="mt-1.5 text-xs text-secondary font-bold">{{
        $t(`values.${category.value}`)
      }}</span>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import * as LucideIcons from 'lucide-vue-next'
const {t} = useI18n()
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

const optionsFilter = computed(() => {
    return [
        { label: t('values.all'), value: 'all', icon: 'Warehouse' },
        { label: t('values.bands'), value: 'bands', icon: 'Music' },
        { label: t('values.foodtruck'), value: 'foodtruck', icon: 'Truck' },
        { label: t('values.catering'), value: 'catering', icon: 'UtensilsCrossed' },
        { label: t('values.lighting'), value: 'lighting', icon: 'Lightbulb' },
        { label: t('values.photo'), value: 'photo', icon: 'Camera' },
        { label: t('values.furniture'), value: 'furniture', icon: 'Armchair' },
        { label: t('values.renting'), value: 'renting', icon: 'MapPin' },
        { label: t('values.other'), value: 'other', icon: 'Ellipsis' },
    ]
})
const eventStore = useEventStore()
const {
  selectCategoryForFilterCompany,
} = storeToRefs(eventStore)

const getIcon = (iconName) => {
  return LucideIcons[iconName] || LucideIcons.HelpCircle
}

const isSelected = (category) => {
    if (!selectCategoryForFilterCompany.value && category.value) return category.value === 'all' 
    return selectCategoryForFilterCompany.value === category?.value

}


const toggleCategory = (category) => {
    eventStore.setTypeOfCompanyCategory(category)
}
</script>
