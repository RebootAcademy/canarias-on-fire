<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div
        v-for="plan in plans"
        :key="plan._id"
        class="text-center bg-white border rounded-lg shadow-sm p-6 pt-12 relative"
        :class="{ 'border-black': getSubscriptionAction(plan) === 'current' }"
      >
        <div
          v-if="plan.name === 'premium'"
          class="absolute top-0 left-0 right-0 bg-black text-center py-1 rounded-t-lg"
        >
          Recommended option
        </div>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ plan.name }}
        </h3>
        <div class="mt-4">
          <span class="text-4xl font-extrabold text-gray-900"
            >{{ plan.pricing }}€</span
          >
          <span class="text-base font-medium text-gray-500"> / MO</span>
        </div>

        <ul class="mt-6 space-y-4 text-left">
          <li v-for="(key, value) in plan.features" :key="key">
            <div
              v-if="value && typeof key !== 'number'"
              class="flex justify-between"
            >
              <p class="ml-3 text-base text-gray-700">
                {{ featureDescriptions[value] }}
              </p>
              <svg
                v-if="key"
                class="flex-shrink-0 h-6 w-6 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <svg
                v-else
                class="flex-shrink-0 h-6 w-6 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </li>
          <li v-for="key in plan.features" v-show="typeof key === 'number'">
            <p class="ml-3 text-base text-gray-700">
              Prioridad de lectura:
              <span class="font-semibold">{{
                getReadingPriorityText(key)
              }}</span>
            </p>
          </li>
        </ul>

        <div class="mt-8">
          <NuxtLink
            v-if="getSubscriptionAction(plan) === 'subscribe'"
            @click="subscribeToPlan(plan)"
            class="inline-block w-full bg-black text-white font-semibold py-2 px-4 rounded-lg text-center hover:bg-gray-800 transition-colors"
          >
            Subscribe
          </NuxtLink>
          <NuxtLink
            v-else-if="getSubscriptionAction(plan) === 'upgrade'"
            @click="upgradeToPlan(plan)"
            class="inline-block w-full bg-black text-white font-semibold py-2 px-4 rounded-lg text-center hover:bg-gray-800 transition-colors"
          >
            Upgrade
          </NuxtLink>
          <NuxtLink
            v-else-if="getSubscriptionAction(plan) === 'downgrade'"
            @click="downgradeToPlan(plan)"
            class="inline-block w-full bg-black text-white font-semibold py-2 px-4 rounded-lg text-center hover:bg-gray-800 transition-colors"
          >
            Downgrade
          </NuxtLink>
          <Button
            v-else
            disabled
            class="inline-block w-full bg-gray-300 text-gray-600 font-semibold py-2 px-4 rounded-lg text-center cursor-not-allowed"
          >
            Current Plan
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  plans: {
    type: Array,
    required: true,
  },
  selectedPlan: {
    type: Object,
    default: null,
  },
  currentPlan: {
    type: String,
    required: true,
  },
})

const route = useRoute()
const userStore = useUserStore()
const subscriptionStore = useSubscriptionStore()

/* const isAdmin = computed(() => userStore.userData.role === 'admin') */

const featureDescriptions = {
  eventPublication: 'Publicación de eventos',
  eventPhotos: 'Fotos del evento o cartelería del mismo',
  readingPriority: 'Prioridad de lectura',
  increasedCharacterLimit:
    'Aumento del número de caracteres para la información',
  websiteLink: 'Enlace a la página web',
  offerPublication: 'Publicación de ofertas',
  rssPublication: 'Publicación en RRSS',
}

const getReadingPriorityText = (value) => {
  switch (value) {
    case 1:
      return 'Alta'
    case 2:
      return 'Media'
    case 3:
      return 'Baja'
    default:
      return 'No especificada'
  }
}

/* const isPlanUpgrade = (plan) => {
  const currentPlanIndex = props.plans.findIndex(p => p.name.toUpperCase() === props.currentPlan.toUpperCase())
  const newPlanIndex = props.plans.findIndex(p => p.name === plan.name)
  return newPlanIndex > currentPlanIndex
}

const isPlanDowngrade = (plan) => {
  const currentPlanIndex = props.plans.findIndex(p => p.name.toUpperCase() === props.currentPlan.toUpperCase())
  const newPlanIndex = props.plans.findIndex(p => p.name === plan.name)
  return newPlanIndex < currentPlanIndex
} */

/* const handleSubscription = async (plan) => {
  try {
    console.log('Handling subscription for plan:', plan)
    
    const userId = route.query.userId || userStore.userData._id
    console.log('User ID for subscription:', userId)
    
    let result
    if (userStore.userData.activeSubscription) {
      // Si ya tiene una suscripción activa, realizamos un upgrade
      result = await subscriptionStore.upgradeSubscription(userId, plan.stripe.planId)
    } else {
      // Si no tiene una suscripción activa, creamos una nueva
      result = await subscriptionStore.createSubscription(userId, plan.stripe.planId)
    }
    
    console.log('Subscription result:', result)
    if (result.success && result.sessionUrl) {
      window.location.href = result.sessionUrl
    } else {
      alert(result?.error || 'Failed to process subscription')
    }
  } catch (error) {
    console.error('Error processing subscription:', error)
    alert('An error occurred while processing the subscription')
  }
} */

const getSubscriptionAction = (plan) => {
  const currentPlan = userStore.userData.activeSubscription
  
  if (!currentPlan) {
    return 'subscribe'
  }

  const planOrder = ['basic', 'premium', 'gold']
  const currentPlanIndex = planOrder.indexOf(currentPlan.name)
  const newPlanIndex = planOrder.indexOf(plan.name)

  if (currentPlanIndex === newPlanIndex) {
    return 'current'
  } else if (newPlanIndex > currentPlanIndex) {
    return 'upgrade'
  } else {
    return 'downgrade'
  }
}

const subscribeToPlan = async (plan) => {
  try {
    const userId = route.query.userId || userStore.userData._id
    const result = await subscriptionStore.createSubscription(userId, plan.stripe.planId)

    if (result.success && result.sessionUrl) {
      await userStore.updateUserSubscription(userId, plan._id, 'active')
      window.location.href = result.sessionUrl
    } else {
      console.error(result?.error || 'Failed to create subscription')
    }
  } catch (error) {
    console.error('Error creating subscription:', error)
  }
}

const upgradeToPlan = async (plan) => {
  try {
    const userId = route.query.userId || userStore.userData._id
    const result = await subscriptionStore.upgradeSubscription(userId, plan.stripe.planId)
    if (result.success && result.sessionUrl) {
      window.location.href = result.sessionUrl
    } else {
      console.error(result?.error || 'Failed to upgrade subscription')
    }
  } catch (error) {
    console.error('Error upgrading subscription:', error)
  }
}

const downgradeToPlan = async (plan) => {
  try {
    const userId = route.query.userId || userStore.userData._id
    const result = await subscriptionStore.downgradeSubscription(userId, plan.stripe.planId)
    if (result.success) {
      console.log(`Your plan will be downgraded to ${plan.name} at the end of your current billing cycle on ${new Date(result.nextBillingDate).toLocaleDateString()}. You will not be charged until then.`)
      userStore.updateUserSubscription(userId, plan._id, 'downgrading')
    } else {
      console.error(result?.error || 'Failed to downgrade subscription')
    }
  } catch (error) {
    console.error('Error downgrading subscription:', error)
  }
}

</script>