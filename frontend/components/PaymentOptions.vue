<template>
  <div
    class="max-w-7xl mx-auto text-secondary text-xs md:text-base sm:px-6 lg:px-8"
    :class="isStripePayment ? 'py-4 sm:py-12' : 'sm:py-6 mb-12'"
  >
    <Spinner v-if="isLoading" />
    <div v-else class="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div
        v-for="payment in sortedPayments"
        :key="payment._id"
        class="text-center bg-gray border border-primary rounded-lg shadow-sm p-6 pt-12 relative"
      >
        <div
          v-if="payment.name === 'optima plus'"
          class="absolute top-0 left-0 right-0 bg-primary-gradient font-bold text-lg text-center py-1 rounded-t-lg"
        >
          {{ $t('recommended') }}
        </div>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ getNameSubscriptionPlan(payment.name) }}
        </h3>
        <div class="mt-4">
          <span
            class="text-4xl font-extrabold bg-gradient-to-r from-[#FBB03B] via-[#F7931E] to-[#ED1C24] inline-block text-transparent bg-clip-text"
          >
            {{ payment.basePrice }}€
            <span class="text-base font-medium text-gray-500"> / MO</span>
          </span>
        </div>

        <ul class="mt-6 space-y-4 text-left">
          <li v-for="(key, value) in payment.features" :key="key">
            <div
              v-if="value && typeof key !== 'number' && typeof key !== 'string'"
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
          <li
            v-for="(feature, index) in payment.features"
            :key="index"
            v-show="typeof feature === 'string'"
          >
            <p class="ml-3 text-base text-gray-700">
              {{ $t('featuresDescriptions.limitPhotos') }}
              <span class="font-semibold">
                {{ Number(feature) }}
              </span>
            </p>
          </li>
          <li
            v-for="(feature, index) in payment.features"
            :key="index"
            v-show="typeof feature === 'number'"
          >
            <p class="ml-3 text-base text-gray-700">
              {{ $t('paymentsOption.readPriority') }}
              <span class="font-semibold">{{
                getReadingPriorityText(feature)
              }}</span>
            </p>
          </li>
        </ul>

        <div v-if="stripePayment" class="mt-8">
          <div class="bg-primary-gradient p-0.5 rounded-md cursor-pointer">
            <NuxtLink
              @click="choosePayment(payment)"
              class="inline-block w-full bg-black text-white font-semibold py-4 px-4 rounded-lg text-center hover:bg-primary-gradient transition-colors"
              :class="{
                'bg-primary-gradient hover:bg-primary':
                  payment.name === 'optima plus',
              }"
            >
              {{ $t('buttons.subscribe') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  payments: {
    type: Array,
    required: true,
  },
  stripePayment: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()
const userStore = useUserStore()
const eventStore = useEventStore()
const paymentStore = usePaymentStore()
const { t } = useI18n()

import { useAuth0 } from '@auth0/auth0-vue'
const { isAuthenticated, getAccessTokenSilently } = useAuth0()
let token = null;
if (isAuthenticated.value) {
  token = await getAccessTokenSilently()
}

const isLoading = ref(false)

const sortedPayments = computed(() => {
  return props.payments
    .filter((p) => p.name !== 'optima plus') // Quitar "optima plus"
    .map((p) => {
      const originalFeatures = p.features || {}

      // Eliminar la feature "rssPublication"
      const filteredFeatures = Object.fromEntries(
        Object.entries(originalFeatures).filter(
          ([key]) => key !== 'rssPublication'
        )
      )

      return {
        ...p,
        features: filteredFeatures,
      }
    })
    .sort((a, b) => a.basePrice - b.basePrice)
})

const featureDescriptions = computed(() => ({
  eventPublication: t('featuresDescriptions.eventPublication'),
  eventPhotos: t('featuresDescriptions.eventPhotos'),
  readingPriority: t('featuresDescriptions.readingPriority'),
  increasedCharacterLimit: t('featuresDescriptions.increasedCharacterLimit'),
  websiteLink: t('featuresDescriptions.websiteLink'),
  offerPublication: t('featuresDescriptions.offerPublication'),
  rssPublication: t('featuresDescriptions.rssPublication'),
  limitPhotos: t('featuresDescriptions.limitPhotos'),
}))

const getReadingPriorityText = (value) => {
  switch (value) {
    case 1:
      return t('priorities.high')
    case 2:
      return t('priorities.medium')
    case 3:
      return t('priorities.low')
    default:
      return t('priorities.notSpecific')
  }
}

const getUserId = () => {
  if (userStore.userData.role === 'admin' && userStore.selectedUser) {
    return userStore.selectedUser._id
  } else {
    return userStore.userData._id
  }
}

const formatDate = (dateObj) => {
  if (!dateObj || typeof dateObj !== 'object') return null
  const { year, month, day } = dateObj
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
    2,
    '0'
  )}`
}

const calculateFinalPrice = (basePrice, eventDate) => {
  const today = new Date()
  const event = new Date(eventDate)
  const daysUntilEvent = Math.max(
    1,
    Math.ceil((event - today) / (1000 * 60 * 60 * 24))
  )

  if (daysUntilEvent <= 30) {
    return basePrice
  } else {
    const pricePerDay = basePrice / 30
    const extraDays = daysUntilEvent - 30
    const finalPrice = basePrice + extraDays * pricePerDay
    return Math.round(finalPrice * 100) / 100
  }
}

const choosePayment = async (plan) => {
  try {
    const userId = getUserId()
    const eventId = eventStore.event._id
    const slug = eventStore.event.slug
    const eventDate = formatDate(eventStore.event.eventDate)

    if (plan.name === 'basic') {
      const result = await paymentStore.assignPaymentToEvent(userId, {
        paymentPlanId: plan._id,
        eventId: eventId,
        eventDate: eventDate,
      })

      if (result.success) {
        const publishResult = await eventStore.updateEventStatus(
          eventId,
          'published',
          token
        )
        if (publishResult) {
          router.push(`/events/${slug}`)
        } else {
          console.error('Failed to publish event')
        }
      } else {
        console.error(result?.error || 'Failed to create basic payment')
      }
    } else {
      const finalPrice = calculateFinalPrice(plan.basePrice, eventDate)
      const result = await paymentStore.createPaymentSession(userId, {
        paymentPlanId: plan._id,
        eventId: eventId,
        eventDate: eventDate,
        finalPrice: finalPrice,
      })

      if (result.success && result.sessionUrl) {
        window.location.href = result.sessionUrl
      } else {
        console.error(result?.error || 'Failed to create payment session')
      }
    }
  } catch (error) {
    console.error('Error processing payment:', error)
  }
}

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
</script>

<style scoped>
.raise,
.raise:focus {
  box-shadow: 0 0.5em 0.5em -0.4em var(--primary);
  transform: translateY(-0.25em);
}
</style>
