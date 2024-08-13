<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div v-for="plan in plans" :key="plan._id" 
           class="text-center bg-white border rounded-lg shadow-sm p-6 pt-12 relative"
           :class="{ 'border-black': isSelected(plan) }">
        <div v-if="plan.name === 'premium'" class="absolute top-0 left-0 right-0 bg-black text-center py-1 rounded-t-lg">Recommended option</div>
        <h3 class="text-lg leading-6 font-medium text-gray-900">{{ plan.name }}</h3>
        <div class="mt-4">
          <span class="text-4xl font-extrabold text-gray-900">{{ plan.pricing }}€</span>
          <span class="text-base font-medium text-gray-500"> / MO</span>
        </div>

        <ul class="mt-6 space-y-4 text-left">
          <li 
            v-for="(key, value) in plan.features" 
            :key="key" 
          >
            <div 
              v-if="value && typeof key !== 'number'"
              class="flex justify-between"
            >
              <p class="ml-3 text-base text-gray-700">{{ featureDescriptions[value] }}</p>
              <svg v-if="key" class="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="flex-shrink-0 h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

          </li>
          <li v-for="key in plan.features" v-show="typeof key === 'number'">
            <p class="ml-3 text-base text-gray-700">Prioridad de lectura: <span class="font-semibold">{{ getReadingPriorityText(key) }}</span></p>
          </li>
        </ul>

        <div class="mt-8">
          <NuxtLink 
            v-if="!isSelected(plan)"
            @click="upgradeToPlan(plan)"
            class="inline-block w-full bg-black text-white font-semibold py-2 px-4 rounded-lg text-center hover:bg-gray-800 transition-colors"
          >
            Select Plan
          </NuxtLink>
          <button
            v-else
            disabled
            class="inline-block w-full bg-gray-300 text-gray-600 font-semibold py-2 px-4 rounded-lg text-center cursor-not-allowed"
          >
            Current Plan
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

const userStore = useUserStore()
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
    case 1: return 'Alta'
    case 2: return 'Media'
    case 3: return 'Baja'
    default: return 'No especificada'
  }
}

const isSelected = (plan) => {
  return props.selectedPlan && props.selectedPlan._id === plan._id
}

const upgradeToPlan = async (plan) => {
  if (userStore.userData && userStore.userData.role === 'admin') {
    if (userStore.selectedUser && userStore.selectedUser._id) {
      const result = await subscriptionStore.upgradeSubscription(userStore.selectedUser._id, plan.stripe.planId)
      if (result && result.success) {
        if (result.paymentLink) {
          // Redirigir al usuario al enlace de pago
          window.location.href = result.paymentLink
        } else {
          // Actualizar el usuario seleccionado en el store
          userStore.updateSelectedUserSubscription(userStore.selectedUser._id, plan._id)
          console.log('Subscription upgraded successfully')
        }
      } else {
        console.log(result?.error || 'Failed to upgrade subscription')
      }
    } else {
      console.error('No selected user data available for upgrading subscription')
    }
  } else {
    if (userStore.userData && userStore.userData._id) {
      const result = await subscriptionStore.upgradeSubscription(userStore.userData._id, plan.stripe.planId)
      if (result && result.success) {
        if (result.paymentLink) {
          // Redirigir al usuario al enlace de pago
          window.location.href = result.paymentLink
        } else {
          // Actualizar el usuario en el store
          userStore.updateUserSubscription(userStore.userData._id, plan._id)
          console.log('Subscription upgraded successfully')
        }
      } else {
        console.log(result?.error || 'Failed to upgrade subscription')
      }
    } else {
      console.error('No user data available for upgrading subscription')
    }
  }
}
</script>