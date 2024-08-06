<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div v-for="plan in plans" :key="plan._id" 
           class="text-center border rounded-lg shadow-sm p-6 pt-12 relative"
           :class="{ 'border-black': isSelected(plan) }">
        <div v-if="plan.name === 'Platinum'" class="absolute top-0 left-0 right-0 bg-black text-white text-center py-1 rounded-t-lg">Recommended option</div>
        <h3 class="text-lg leading-6 font-medium text-gray-900">{{ plan.name }}</h3>
        <div class="mt-4">
          <span class="text-4xl font-extrabold text-gray-900">{{ plan.pricing }}€</span>
          <span class="text-base font-medium text-gray-500"> / MO</span>
        </div>

        <ul class="mt-6 space-y-4">
          <li v-for="(key, value) in plan.features" :key="key" class="flex items-start">
              <svg v-if="key" class="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="flex-shrink-0 h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p class="ml-3 text-base text-gray-700">{{ featureDescriptions[value] }}</p>
          </li>
        </ul>

        <div class="mt-8">
          <button 
            @click="selectPlan(plan)"
            :class="[
              isSelected(plan) 
                ? 'bg-gray-200 text-gray-900' 
                : 'bg-black text-white',
              'w-full font-semibold py-2 px-4 rounded-lg'
            ]"
          >
            {{ isSelected(plan) ? 'Current Plan' : 'Select Plan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  plans: {
    type: Array,
    required: true
  },
  selectedPlan: {
    type: Object,
    default: null
  }
})

const subscriptionStore = useSubscriptionStore()
const emit = defineEmits(['planSelected'])

const featureDescriptions = {
  eventPublication: 'Publicación de eventos',
  eventPhotos: 'Fotos del evento o cartelería del mismo',
  readingPriority: 'Prioridad de lectura',
  increasedCharacterLimit: 'Aumento del número de caracteres para la información',
  websiteLink: 'Enlace a la página web',
  offerPublication: 'Publicación de ofertas',
  rssPublication: 'Publicación en RRSS',
}

const getReadingPriorityText = (value) => {
  switch (value) {
    case 1:
      return 'Prioridad de lectura: Alta';
    case 2:
      return 'Prioridad de lectura: Media';
    case 3:
      return 'Prioridad de lectura: Baja';
    default:
      return 'Prioridad de lectura: No especificada';
  }
}

const isSelected = (plan) => {
  return props.selectedPlan && props.selectedPlan._id === plan._id
}

const selectPlan = (plan) => {
  subscriptionStore.setSelectedPlan(plan)
  emit('planSelected', plan)
}
</script>