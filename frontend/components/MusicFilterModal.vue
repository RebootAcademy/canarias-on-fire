<template>
  <div
    v-if="openModal"
    @click="closeModal"
    class="fixed inset-0 bg-black bg-opacity-50 z-[60]"
  ></div>

  <!-- Modal -->
  <div
    v-if="openModal"
    class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[70vh] md:h-[50vh] md:w-[80vw] xl:w-[50vw] bg-primary/40 z-[70] rounded-sm text-black"
  >
    <div
      class="relative grid grid-cols-1 md:grid-rows-2 gap-y-1 md:gap-4 p-4 md:grid-cols-4 h-full"
    >
      <div
        v-for="genre in genresItems"
        :key="genre.value"
        class="border flex items-center justify-center text-center text-black cursor-pointer rounded-sm bg-white bg-opacity-90 genre-item"
        :class="[
          eventStore.selectedGenres.includes(genre.value)
            ? 'bg-primary-gradient text-white'
            : '',
        ]"
        @click="
          () => {
            eventStore.toggleGenre(genre.value)
            if (genre.value === 'all') {
              nextTick(() => {
                closeModal()
              })
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
import { nextTick } from 'vue'
import { defineProps, defineEmits } from 'vue'
import { storeToRefs } from 'pinia'
const { t } = useI18n()
const eventStore = useEventStore()
const { selectedCategories } = storeToRefs(eventStore)
const emit = defineEmits(['close'])
const props = defineProps({
  openModal: {
    type: Boolean,
    required: true,
  },
})

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
const closeModal = () => {
  emit('close')
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
