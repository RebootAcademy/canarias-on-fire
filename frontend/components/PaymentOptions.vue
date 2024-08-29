<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div
        v-for="payment in payments"
        :key="payment._id"
        class="text-center bg-white border rounded-lg shadow-sm p-6 pt-12 relative"
      >
        <div
          v-if="payment.name === 'premium'"
          class="absolute top-0 left-0 right-0 bg-black text-center py-1 rounded-t-lg"
        >
          Recommended option
        </div>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ payment.name }}
        </h3>
        <div class="mt-4">
          <span class="text-4xl font-extrabold text-gray-900"
            >{{ payment.basePrice }}€</span
          >
          <span class="text-base font-medium text-gray-500"> / MO</span>
        </div>

        <ul class="mt-6 space-y-4 text-left">
          <li v-for="(key, value) in payment.features" :key="key">
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
          <li v-for="key in payment.features" v-show="typeof key === 'number'">
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
            @click="choosePayment(payment)"
            class="inline-block w-full bg-black text-white font-semibold py-2 px-4 rounded-lg text-center hover:bg-gray-800 transition-colors"
          >
            Subscribe
          </NuxtLink>
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
})

const router = useRouter()
const userStore = useUserStore()
const eventStore = useEventStore()
const paymentStore = usePaymentStore()

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
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const calculateFinalPrice = (basePrice, eventDate) => {
  const today = new Date()
  const event = eventDate ? new Date(eventDate) : new Date()
  const daysUntilEvent = Math.max(1, Math.ceil((event - today) / (1000 * 60 * 60 * 24)))
  return Math.max(basePrice, basePrice * daysUntilEvent)
}

const choosePayment = async (plan) => {
  try {
    const userId = getUserId()
    const eventId = eventStore.event._id
    const eventDate = formatDate(eventStore.event.eventDate)

    console.log('Selected plan:', plan)
    console.log('Event date:', eventDate)

    if (plan.name === 'basic') {
      const result = await paymentStore.assignPaymentToEvent(userId, {
        paymentPlanId: plan._id,
        eventId: eventId,
        eventDate: eventDate,
      })

      if (result.success) {
        const publishResult = await eventStore.updateEventStatus(eventId, 'published')
        if (publishResult) {
          router.push(`/events/${eventId}`)
        } else {
          console.error('Failed to publish event')
        }
      } else {
        console.error(result?.error || 'Failed to create basic payment')
      }
    } else {
      const finalPrice = calculateFinalPrice(plan.basePrice, eventDate)
      console.log('Calculated final price:', finalPrice)

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
</script>
