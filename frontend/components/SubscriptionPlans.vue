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
          <li v-for="feature in plan.characteristics" :key="feature" class="flex items-start">
            <svg class="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <p class="ml-3 text-base text-gray-700">{{ feature }}</p>
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

const emit = defineEmits(['planSelected'])

const subscriptionStore = useSubscriptionStore()

const isSelected = (plan) => {
  return props.selectedPlan && props.selectedPlan._id === plan._id
}

const selectPlan = (plan) => {
  subscriptionStore.setSelectedPlan(plan)
  emit('planSelected', plan)
}
</script>