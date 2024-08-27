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
  }
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

const choosePayment = async (payment) => {
  try {
    const userId = getUserId()
    const eventId = eventStore.event._id

    if (payment.name === 'basic') {
      // For basic plan, publish the event directly
     
      const result = await eventStore.updateEventStatus(eventId, 'published')
      if (result) {
        // Create a record of the free payment
        await paymentStore.createPayment(userId, {
          paymentId: payment._id,
          eventId: eventId,
          eventDate: eventStore.event.eventDate
        })
        // Redirect to home page
        router.push('/')
      } else {
        console.error('Failed to publish event')
      }
    } else {
      // For paid plans, create a payment and redirect to Stripe
      const result = await paymentStore.createPayment(userId, {
        paymentId: payment._id,
        eventId: eventId,
        eventDate: eventStore.event.eventDate
      })
      if (result.success && result.sessionUrl) {
        window.location.href = result.sessionUrl
      } else {
        console.error(result?.error || 'Failed to create payment')
      }
    }
  } catch (error) {
    console.error('Error processing payment:', error)
  }
}

</script>