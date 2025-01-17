<template>
  <div class="flex flex-col text-secondary gap-2">
    <p class="font-semibold">{{ $t('tags') }}</p>
    <p class="text-sm text-secondary mb-2">
      {{ type === 'event' ? $t('chooseTags') : $t('chooseTagsPromo') }}
    </p>
    <div class="flex flex-wrap justify-center gap-2 p-2 mb-4">
      <Badge
        v-for="category in filteredCategories"
        :key="category.id"
        :class="{
          'bg-transparent border-primary text-primary': isSelected(category),
          'bg-gray text-secondary': !isSelected(category),
        }"
        @click="toggleCategory(category)"
        variant="secondary"
        class="p-2 px-4 cursor-pointer hover:bg-secondary hover:text-primary"
      >
        {{ $t(`values.${category.name}`) }}
      </Badge>
    </div>
    <div v-if="isThereService" class="flex flex-col gap-2">
      <p>{{ $t('chooseServicesTags') }}</p>
      <div class="flex flex-wrap justify-center gap-2 p-2 mb-4">
        <Badge
          v-for="(category, idx) in typeOfServices"
          :key="idx"
          :class="{
            'bg-transparent border-primary text-primary': isServiceSelected(
              category.value
            ),
            'bg-gray text-secondary': !isServiceSelected(category.value),
          }"
          @click="toogleServicesCategory(category.value)"
          variant="secondary"
          class="p-2 px-4 cursor-pointer hover:bg-secondary hover:text-primary"
        >
          {{ $t(`values.${category.value}`) }}
        </Badge>
      </div>
    </div>
    <div v-if="isMusic" class="flex flex-col gap-2">
      <p>{{ $t('chooseMusicTags')}}</p>
      <div class="flex flex-wrap justify-center gap-2 p-2 mb-4">
        <Badge
          v-for="(category, idx) in musicTypes"
          :key="idx"
          :class="isMusicTypeSelected(category.value) ?
          'bg-transparent border-primary text-primary' :
          'bg-gray text-secondary'
          "
          @click="toggleMusicCategory(category.value)"
          variant="secondary"
          class="p-2 px-4 cursor-pointer hover:bg-secondary hover:text-primary"
          >
          {{ $t(`values.${category.value}`) }}
          </Badge>
        </div>
    </div>
    <span v-if="eventStore.hasTriedSubmit" class="text-red-500 text-xs">{{
      errors.categories
    }}</span>
  </div>
  <hr class="mb-4" />
</template>

<script setup>
const { t } = useI18n()
import { errors, validateFields } from '../utils/validation'
const eventStore = useEventStore()
const { selectedCategories } = storeToRefs(eventStore)
const typeOfServices = computed(() => [
  { label: t('values.foodtruck'), value: 'foodtruck', icon: 'Truck' },
  { label: t('values.catering'), value: 'catering', icon: 'UtensilsCrossed' },
  { label: t('values.lighting'), value: 'sound', icon: 'Lightbulb' },
  { label: t('values.photography'), value: 'photo', icon: 'Camera' },
  { label: t('values.furniture'), value: 'furniture', icon: 'Armchair' },
  { label: t('values.places'), value: 'renting', icon: 'MapPin' },
  { label: t('values.other'), value: 'other', icon: 'Ellipsis' },
])

const musicTypes = computed(() => {
  return [
    { value: 'djs', label: t('onBoarding.step2Genres.djs') },
    { value: 'electronic', label: t('onBoarding.step2Genres.electronic') },
    { value: 'rock', label: t('onBoarding.step2Genres.rock') },
    { value: 'jazz', label: t('onBoarding.step2Genres.jazz') },
    { value: 'metal', label: t('onBoarding.step2Genres.metal') },
    { value: 'latina', label: t('onBoarding.step2Genres.latina') },
    { value: 'classic', label: t('onBoarding.step2Genres.classic') },
    { value: 'other', label: t('onBoarding.step2Genres.other') }
  ]
})

const isThereService = computed(() => {
  return selectedCategories.value.some((c) => c?.name === 'services')
})

const isMusic = computed(() => {
  return selectedCategories.value.some((c) => c?.name === 'music')
})

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    required: true,
    default: 'event',
  },
})

const filteredCategories = computed(() => {
  if (props.type === 'event') {
    eventStore.selectedCategories.some(
    (c) => c && c.type === 'promotion'
    ) && eventStore.setSelectedCategories([]); eventStore.setSelectedCategoriesOfServices([])
    return eventStore.categories.filter((cat) => cat.type === 'event')
  } else {
    eventStore.selectedCategories.some(
    (c) => c && c.type === 'event'
    ) && eventStore.setSelectedCategories([])
    return eventStore.categories.filter((cat) => cat.type === 'promotion')
  }
})

onMounted(async () => {
  if (props.isEditing && eventStore.event && eventStore.event.categories) {
    eventStore.selectedCategories = eventStore.event.categories
  }
})

const isSelected = (category) => {
  return (
    Array.isArray(eventStore.selectedCategories) &&
    eventStore.selectedCategories.some((c) => c && c.id === category.id)
  )
}

const isServiceSelected = (category) => {
  return eventStore.selectedCategoriesByServices.some(
    (c) => c && c === category
  )
}

const toggleCategory = (category) => {
  if (!category || !category.id) {
    console.error('Invalid category:', category)
    return
  }

  if (eventStore.selectedCategories.lenght > 0 ) {

  }

  if (!Array.isArray(eventStore.selectedCategories)) {
    console.warn('selectedCategories was not an array, resetting...')
    eventStore.setSelectedCategories([]) // Reinicia como un array vacío
  }

  const isPromotion = eventStore.eventType === 'promotion'
  let updatedCategories

  if (isPromotion) {
    if(!eventStore.selectedCategories.some((c) => c.name === 'services')) {
      eventStore.setSelectedCategoriesOfServices('delete')
    }
    if (
      eventStore.selectedCategories.length === 1 &&
      eventStore.selectedCategories[0].id === category.id
    ) {
      eventStore.setSelectedCategories([])
    } else {
      eventStore.setSelectedCategories([category])
    }
  } else {
    const index = eventStore.selectedCategories.findIndex(
      (c) => c && c.id === category.id
    )

    if (index === -1) {
      updatedCategories = [...eventStore.selectedCategories, category]
    } else {
      if (category.name === 'services') {
        eventStore.setSelectedCategoriesOfServices('delete')
      }
      updatedCategories = eventStore.selectedCategories.filter(
        (c) => c && c.id !== category.id
      )
    }
    eventStore.setSelectedCategories(updatedCategories)
  }
}

const toogleServicesCategory = (category) => {
  const index = eventStore.selectedCategoriesByServices.findIndex(
    (c) => c && c === category
  )

  let updatedCategories
  if (index === -1) {
    // updatedCategories = [...eventStore.selectedCategoriesByServices, category]
    updatedCategories = [ category ]
  } else {
    updatedCategories = eventStore.selectedCategoriesByServices.filter(
      (c) => c && c !== category
    )
  }

  eventStore.setSelectedCategoriesOfServices(updatedCategories)
}

const toggleMusicCategory = (value) => {
  eventStore.musicType = value
}

const isMusicTypeSelected = (value) => {
  return value === eventStore.musicType
}

</script>
