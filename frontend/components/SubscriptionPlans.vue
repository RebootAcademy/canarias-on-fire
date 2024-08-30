<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div
        v-for="plan in filteredPlans"
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
            v-else-if="getSubscriptionAction(plan) === 'current'"
            disabled
            class="inline-block w-full bg-gray-300 text-gray-600 font-semibold py-2 px-4 rounded-lg text-center cursor-not-allowed"
          >
            Current Plan
          </Button>
          <Button
            v-else-if="getSubscriptionAction(plan) === 'disabled'"
            disabled
            class="inline-block w-full bg-gray-300 text-gray-600 font-semibold py-2 px-4 rounded-lg text-center cursor-not-allowed"
          >
            Downgrade Scheduled
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

const router = useRouter()
const userStore = useUserStore()
const subscriptionStore = useSubscriptionStore()

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

const filteredPlans = computed(() => {
  return props.plans.filter(plan => (plan.name !== 'premium' && plan.name !== 'basic'))
})

const getFullPlanInfo = (planId) => {
  return subscriptionStore.subscriptions.find(plan => plan._id === planId)
}

const getActiveSubscription = () => {
  if (userStore.userData.role === 'admin' && userStore.selectedUser) {
    return userStore.selectedUser.activeSubscription || {}
  } else {
    return userStore.userData.activeSubscription || {}
  }
}

const getSubscriptionAction = (plan) => {
  const currentSubscription = getActiveSubscription()
  
  if (!currentSubscription || !currentSubscription.plan) {
    return 'subscribe'
  }

  const currentPlan = getFullPlanInfo(currentSubscription.plan)
  
  if (!currentPlan) {
    return 'unknown'
  }

  const planOrder = ['basic', 'gold', 'premium'] // Corregido el orden de los planes
  const currentPlanIndex = planOrder.indexOf(currentPlan.name)
  const newPlanIndex = planOrder.indexOf(plan.name)

  if (currentPlanIndex === -1 || newPlanIndex === -1) {
    return 'unknown'
  }

  if (currentSubscription.status === 'downgrading') {
    return currentSubscription.nextPlan && currentSubscription.nextPlan === plan._id ? 'current' : 'disabled'
  }

  if (currentSubscription.status === 'canceled' || currentSubscription.status === 'inactive') {
    return 'subscribe'
  }

  if (currentPlanIndex === newPlanIndex) {
    return 'current'
  } else if (newPlanIndex > currentPlanIndex) {
    return 'upgrade'
  } else {
    return 'downgrade'
  }
}

const getUserId = () => {
  if (userStore.userData.role === 'admin' && userStore.selectedUser) {
    return userStore.selectedUser._id
  } else {
    return userStore.userData._id
  }
}

const subscribeToPlan = async (plan) => {
  try {
    const userId = getUserId()
    if (plan.name === 'basic') {
      const result = await subscriptionStore.createSubscription(userId, plan.stripe.planId)
      if (result.success) {
        await userStore.updateUserSubscription(userId, plan._id, 'active')
        router.push('/subscription/success')
      } else {
        console.error(result?.error || 'Failed to create basic subscription')
      }
    } else {
      const result = await subscriptionStore.createSubscription(userId, plan.stripe.planId)
      if (result.success && result.sessionUrl) {
        await userStore.updateUserSubscription(userId, plan._id, 'active')
        window.location.href = result.sessionUrl
      } else {
        console.error(result?.error || 'Failed to create subscription')
      }
    }
  } catch (error) {
    console.error('Error creating subscription:', error)
  }
}

const upgradeToPlan = async (plan) => {
  console.log('upgradeToPlan called with plan:', plan)
  try {
    const userId = getUserId()
    console.log('Calling subscriptionStore.upgradeSubscription with userId:', userId, 'and planId:', plan.stripe.planId)
    const result = await subscriptionStore.upgradeSubscription(userId, plan.stripe.planId)
    console.log('Result from upgradeSubscription:', result)

    if (result.success && result.sessionUrl) {
      console.log('Redirecting to Stripe session URL:', result.sessionUrl)
      window.location.href = result.sessionUrl
    } else {
      console.error('Failed to upgrade subscription:', result.error)
    }
  } catch (error) {
    console.error('Error in upgradeToPlan:', error)
  }
}

const downgradeToPlan = async (plan) => {
  try {
    const userId = getUserId()
    const result = await subscriptionStore.downgradeSubscription(userId, plan.stripe.planId)

    if (result.success) {
      await userStore.updateUserSubscription(userId, plan._id, 'downgrading')
      alert(`The plan will be downgraded to ${plan.name} at the end of the current billing cycle on ${new Date(result.nextBillingDate).toLocaleDateString()}. No charges will be made until then.`)
      router.push('/subscription/success')
    } else {
      alert(result.error || 'Failed to downgrade subscription. Please try again later.')
    }
  } catch (error) {
    console.error('An error occurred while downgrading the subscription. Please try again later.')
  }
}

</script>