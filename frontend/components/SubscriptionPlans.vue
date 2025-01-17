<template>
  <div class="max-w-7xl mx-auto sm:py-4 sm:px-6 lg:px-8">
    <div
      class="mt-16 grid grid-cols-1 md:grid-cols-4 lg:gap-16 xl:gap-20 xl:px-48"
    >
      <div
        v-for="plan in filteredPlans"
        :key="plan._id"
        class="text-center bg-gray border border-primary rounded-lg shadow-sm p-6 pt-12 relative col-start-2 col-end-4"
        :class="{ 'border-black': getSubscriptionAction(plan) === 'current' }"
      >
        <!--  <div
          v-if="plan.name === 'optima'"
          class="absolute top-0 left-0 right-0 bg-primary-gradient font-bold text-lg text-center py-1 rounded-t-lg"
        >
          {{ $t('recommended') }}
        </div> -->
        <h3 class="text-lg leading-6 font-medium text-secondary">
          {{ getNameSubscriptionPlan(plan.name) }}
        </h3>
        <div
          class="mt-4 bg-gradient-to-r from-[#FBB03B] via-[#F7931E] to-[#ED1C24] text-transparent bg-clip-text"
        >
          <span class="text-4xl font-extrabold t">{{ plan.pricing }}€</span>
          <span class="text-base font-medium"> / MO</span>
        </div>

        <ul class="mt-6 space-y-4 text-left">
          <li v-for="(key, value) in plan.features" :key="key">
            <div
              v-if="value && typeof key !== 'number' && typeof key !== 'string'"
              class="flex justify-between"
            >
              <p class="ml-3 text-base text-secondary">
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
                background
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
          <li
            v-for="key in plan.features"
            v-show="typeof key === 'string'"
            :key="key"
          >
            <p class="ml-3 text-base text-secondary">
              {{ $t('featuresDescriptions.limitPhotos') }}
              <span class="font-semibold ml-1">{{ Number(key) }}</span>
            </p>
          </li>
          <li
            v-for="key in plan.features"
            v-show="typeof key === 'number'"
            :key="key"
          >
            <p class="ml-3 text-base text-secondary">
              {{ $t('featuresDescriptions.readingPriority') }}
              <span class="font-semibold">{{
                getReadingPriorityText(key)
              }}</span>
            </p>
          </li>
        </ul>

        <div
          v-if="userStore.isAuthenticated && !isAdmin && !isInformation"
          class="mt-8"
        >
          <NuxtLink
            v-if="getSubscriptionAction(plan) === 'subscribe'"
            @click="subscribeToPlan(plan)"
            class="cursor-pointer inline-block w-full bg-black text-white font-semibold py-2 px-4 rounded-lg text-center hover:bg-primary-gradient transition-colors"
          >
            {{ $t('buttons.subscribe') }}
          </NuxtLink>
          <NuxtLink
            v-else-if="getSubscriptionAction(plan) === 'upgrade'"
            @click="upgradeToPlan(plan)"
            class="inline-block w-full bg-black text-white font-semibold py-2 px-4 rounded-lg text-center hover:bg-primary-gradient transition-colors"
          >
            Upgrade
          </NuxtLink>
          <NuxtLink
            v-else-if="getSubscriptionAction(plan) === 'downgrade'"
            @click="downgradeToPlan(plan)"
            class="inline-block cursor-pointer w-full bg-black text-white font-semibold py-2 px-4 rounded-lg text-center hover:bg-primary-gradient transition-colors"
          >
            Downgrade
          </NuxtLink>
          <div v-else-if="getSubscriptionAction(plan) === 'current'">
            <Button
              disabled
              class="inline-block w-full bg-gray-300 text-gray-600 font-semibold py-2 px-4 rounded-lg text-center cursor-not-allowed"
            >
              {{ $t('buttons.current') }}
            </Button>
            <Button
              v-if="!isCanceled"
              class="cursor-pointer mt-2 inline-block w-full bg-grey border-2 border-red-400 text-red-400 font-semibold py-2 px-4 rounded-lg text-center hover:bg-red-500 hover:border-none hover:text-white transition-colors"
              @click="cancelSubscription(plan)"
            >
              {{ $t('buttons.cancel') }}
            </Button>
            <p
              v-if="isCanceled"
              class="mt-2 text-center text-whitegray text-xs italic font-semibold"
            >
              {{ $t('promotions.canceledSubscrition') }}
              {{
                new Date(
                  userStore.userData.activeSubscription?.canceledAt
                ).toLocaleDateString()
              }}
            </p>
          </div>
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
import { useToast } from '@/components/ui/toast/use-toast'
const eventStore = useEventStore()

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
  isHired: {
    type: Boolean,
    default: false,
  },
  isInformation: {
    type: Boolean,
    default: false,
  },
  isToPublishPromo: {
    type: Boolean,
    default: false,
  },
})

const { toast } = useToast()
const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const subscriptionStore = useSubscriptionStore()
const isAdmin = computed(() => userStore?.userData?.role === 'admin')

const getNameSubscriptionPlan = (plan) => {
  switch (plan) {
    case 'basic':
      return t('plansName.basic')
    case 'optima':
      return t('plansName.optima')
    case 'optima plus':
      return t('plansName.optimaPlus')
    default:
      break
  }
}

const isCanceled = computed(() => {
  if (userStore.userData.activeSubscription?.status === 'canceled') {
    return true
  } else {
    return false
  }
})

const isCanceledAndOutOfDate = computed(() => {
  if (userStore.userData.activeSubscription?.status === 'canceled') {
    if (
      new Date() > new Date(userStore.userData.activeSubscription?.canceledAt)
    ) {
      return true
    } else {
      return false
    }
  }
})

const featureDescriptions = computed(() => ({
  eventPublication: t('featuresDescriptions.promotionPublication'),
  eventPhotos: t('featuresDescriptions.eventPhotos'),
  readingPriority: t('featuresDescriptions.readingPriority'),
  increasedCharacterLimit: t('featuresDescriptions.increasedCharacterLimit'),
  websiteLink: t('featuresDescriptions.websiteLink'),
  offerPublication: t('featuresDescriptions.offerPublication'),
  limitPhotos: t('featuresDescriptions.limitPhotos'),
}))

const getReadingPriorityText = (value) => {
  switch (value) {
    case 1:
      return 'Alta'
    case 2:
      return 'Alta'
    case 3:
      return 'Baja'
    default:
      return 'No especificada'
  }
}

const filteredPlans = computed(() => {
  return props.plans.filter((plan) => plan.name === 'optima')
})

const getFullPlanInfo = (planId) => {
  return subscriptionStore.subscriptions.find((plan) => plan._id === planId)
}

const getActiveSubscription = () => {
  if (userStore.userData?.role === 'admin' && userStore?.selectedUser) {
    return userStore.selectedUser.activeSubscription || {}
  } else {
    return userStore.userData?.activeSubscription || {}
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

  const planOrder = ['basic', 'optima', 'optima plus']
  const currentPlanIndex = planOrder.indexOf(currentPlan.name)
  const newPlanIndex = planOrder.indexOf(plan.name)

  if (currentPlanIndex === -1 || newPlanIndex === -1) {
    return 'unknown'
  }

  if (currentSubscription.status === 'downgrading') {
    return currentSubscription.nextPlan &&
      currentSubscription.nextPlan === plan._id
      ? 'current'
      : 'disabled'
  }

  if (currentSubscription.status === 'inactive') {
    return 'subscribe'
  }

  if (
    currentSubscription.status === 'canceled' &&
    isCanceledAndOutOfDate.value
  ) {
    return 'subscribe'
  }

  if (currentPlanIndex === newPlanIndex) {
    return 'current'
  } else if (newPlanIndex > currentPlanIndex) {
    return 'upgrade'
  } else if (newPlanIndex < currentPlanIndex) {
    return ''
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
      const result = await subscriptionStore.createSubscription(
        userId,
        plan.stripe.planId
      )
      if (result.success) {
        await userStore.updateUserSubscription(userId, plan._id, 'active')
        toast({
          description: t('subscribedPlan'),
        })
        router.push('/subscription/success')
      } else {
        console.error(result?.error || 'Failed to create basic subscription')
      }
    } else {
      const result = await subscriptionStore.createSubscription(
        userId,
        plan.stripe.planId
      )
      if (result.success && result.sessionUrl) {
        if (props.isToPublishPromo) {
          await eventStore.updateEventStatus(eventStore.event._id, 'published')
        }
        await userStore.updateUserSubscription(userId, plan._id, 'active')
        await userStore.fetchAndSetUser(userStore.userData.email)
        window.location.href = result.sessionUrl
      } else {
        console.error(result?.error || 'Failed to create subscription')
      }
    }
  } catch (error) {
    console.error('Error creating subscription:', error)
  }
}

const cancelSubscription = async (plan) => {
  try {
    const userId = getUserId()
    const result = await subscriptionStore.cancelSubscription(userId, plan._id)
    if (result.success) {
      await userStore.updateUserSubscription(userId, plan._id, 'canceled')
      if (plan.name === 'basic') {
        toast({
          description: t('canceledPlan'),
        })
      }
    } else {
      console.error(result?.error || 'Failed to cancel subscription')
    }
  } catch (error) {
    console.error('Error canceling subscription:', error)
  }
}

const upgradeToPlan = async (plan) => {
  try {
    const userId = getUserId()
    const result = await subscriptionStore.upgradeSubscription(
      userId,
      plan.stripe.planId
    )

    if (result.success && result.sessionUrl) {
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
    const result = await subscriptionStore.downgradeSubscription(
      userId,
      plan.stripe.planId
    )

    if (result.success) {
      await userStore.updateUserSubscription(userId, plan._id, 'downgrading')
      alert(
        `The plan will be downgraded to ${
          plan.name
        } at the end of the current billing cycle on ${new Date(
          result.nextBillingDate
        ).toLocaleDateString()}. No charges will be made until then.`
      )
      router.push('/subscription/success')
    } else {
      alert(
        result.error ||
          'Failed to downgrade subscription. Please try again later.'
      )
    }
  } catch (error) {
    console.error(
      'An error occurred while downgrading the subscription. Please try again later.'
    )
  }
}
</script>
