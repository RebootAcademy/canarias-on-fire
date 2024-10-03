<template>
  <div class="relative bg-background text-secondary">
    <NuxtImg
      :src="eventStore.event.coverImage || defaultImage"
      alt="Event Image"
      class="w-full h-96 object-cover"
    />
    <div class="flex gap-2 justify-between">
      <div class="flex p-8 gap-2">
        <span
          v-for="category in event.categories"
          :key="category._id"
          class="bg-gray text-secondary text-xs font-semibold px-4 py-1 rounded-full"
        >
          {{ category.name }}
        </span>
      </div>
      <div class="flex items-center gap-2 my-6 mr-6">
        <Share2
          class="mr-2 w-8 cursor-pointer hover:text-primary"
          @click="copyToClipboard"
        />
        <Pencil
          v-if="isAdmin || isOwner"
          class="mr-2 w-8 cursor-pointer hover:text-primary"
          @click="editEvent"
        />
        <Trash
          v-if="isAdmin || isOwner"
          class="mr-2 w-8 cursor-pointer hover:text-red-500"
          @click="isOpen = true"
        />
      </div>
    </div>
    <div
      class="flex flex-col-reverse gap-4 sm:gap-0 sm:flex-row justify-between px-8 text-secondary"
    >
      <div class="flex flex-col gap-4 sm:w-3/5 md:w-4/5">
        <h1 class="text-3xl font-bold text-primary">{{ event.eventName }}</h1>
        <div class="flex justify-between">
          <div class="flex flex-col gap-1 mt-2">
            <h2 class="text-2xl font-semibold mt-4">
              {{ $t('previewText.dateAndTime') }}
            </h2>
            <div class="flex items-center gap-1">
              <Clock size="16" />
              <span>{{ event.startTime }} - {{ event.endTime }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Calendar size="16" />
              <span>{{ formattedDate }}</span>
            </div>
          </div>
        </div>
        <div class="mt-8">
          <h2 class="text-2xl font-semibold">
            {{
              eventType === 'event'
                ? $t('previewText.aboutEvent')
                : $t('previewText.aboutPromo')
            }}
          </h2>
          <div class="prose max-w-none" v-html="event.eventDescription"></div>
        </div>
        <div
          class="flex flex-col gap-2 my-8"
          v-if="event.eventLocation && event.eventLocation.address"
        >
          <h2 class="text-2xl font-semibold">{{ $t('eventLocation') }}</h2>
          <div class="flex gap-2">
            <MapPin size="20" />
            <p>{{ event.eventLocation.address }}</p>
          </div>
          <details
            v-if="event.eventLocation.mapImageUrl"
            class="w-full lg:w-2/3"
          >
            <summary class="text-primary">
              {{ $t('previewText.showMap') }}
            </summary>
            <NuxtImg
              :src="event.eventLocation.mapImageUrl"
              alt="Event Location"
              class="w-full h-60 lg:h-[500px] object-cover mt-4"
            />
          </details>
          <p v-else-if="pending">Cargando mapa...</p>
          <p v-else>No hay imagen del mapa disponible</p>
        </div>
        <!--     <div class="mt-6">
        <h2 class="text-xl font-semibold">Organizador</h2>
        <p>{{ event.userId?.companyName }}</p>
      </div> -->
        <div v-if="evenType === 'event'" class="my-6">
          <TicketButton />
        </div>
        <div v-show="!isBasicPayment">
          <EventGallery />
        </div>
        <div class="flex gap-2 mt-6 mb-6">
          <div
            v-if="event.status === 'draft' && isValidated && isOwner"
            class="bg-primary-gradient p-0.5 rounded-md"
            @click="publishEvent"
          >
            <Button
              class="px-4 bg-background rounded-md hover:text-white hover:bg-primary-gradient"
            >
              {{ $t('buttons.publish') }}
            </Button>
          </div>
        </div>
      </div>
      <div v-if="evenType === 'event'">
        <TicketButton hasBorder="hasBorder" />
      </div>
      <div v-else>
        <DiscountSquare :event="event" />
      </div>
    </div>
  </div>
  <div class="px-8">
    <EventsRelated :type="evenType" />
  </div>
  <CustomModal v-model:open="isOpen">
    <p class="font-bold text-2xl">{{ $t('areYouSure') }}</p>
    <p class="text-lg">
      {{ eventType === 'event' ? $t('deleteEvent') : $t('deletePromo') }}
    </p>
    <div class="flex justify-end gap-4 mt-2">
      <button
        @click="isOpen = false"
        class="font-bold p-2 px-6 rounded-md bg-gray hover:bg-red-500"
      >
        {{ $t('buttons.cancel') }}
      </button>
      <CustomBtn :title="$t('buttons.confirm')" @click="deleteEvent" />
    </div>
  </CustomModal>
</template>

<script setup>
import { Share2, Pencil, Trash, Clock, Calendar, MapPin } from 'lucide-vue-next'
const { t } = useI18n()
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
import { formatEventDate } from '@/utils/dateUtils'
import { storeToRefs } from 'pinia'
import DiscountSquare from '~/components/DiscountSquare.vue'

const userStore = useUserStore()
const eventStore = useEventStore()
const paymentStore = usePaymentStore()
const subscriptionStore = useSubscriptionStore()
const route = useRoute()
const router = useRouter()

const isOpen = ref(false)

const eventType = computed(() => {
  return eventStore.event.eventType
})

const { event } = storeToRefs(eventStore)
const defaultImage = '/defaultImg.png'
const eventId = route.params.id
const isAdmin = userStore.userData?.role === 'admin'
const isValidated = userStore?.userData?.isValidated

const isBasicPayment = computed(() => {
  if (eventType !== 'event') {
    const subscription = subscriptionStore.getTypeOfSubscription(
      eventStore.event?.subscription?._id
    )
    return subscription?.name === 'basic'
  } else {
    const payment = paymentStore.getPaymentById(eventStore.event.payment)
    return payment?.name === 'basic'
  }
})


const categoryServices = computed(() => {
  return eventStore.event?.categoriesOfServices
})

const { data, pending, error } = await eventStore.fetchEventById(eventId)

if (error) {
  console.error('Error fetching event:', error)
}

const isOwner = computed(() => {
  return eventStore.event?.userId._id === userStore.userData?._id
})

const editEvent = () => {
  router.push(`/events/edit/${eventId}`)
}

const deleteEvent = async () => {
  await eventStore.deleteEvent(event.value._id)
  toast({
    description:
      eventType.value === 'event'
        ? t('deleteEventSuccess')
        : t('deletePromoSuccess'),
  })
  router.push('/')
}

const formattedDate = computed(() => {
  if (eventStore.event.eventType === 'event') {
    return formatEventDate(event.value?.eventDate)
  } else {
    return `${formatEventDate(
      event.value?.eventDate.start
    )} - ${formatEventDate(event.value?.eventDate.end)}`
  }
})

const formatPrice = computed(() => {
  return event.value.eventPrice === 0 ? 'Free' : `${event.value.eventPrice} €`
})

const publishEvent = async () => {
  try {
    const today = new Date().getTime()
    const activeSubscription = userStore.userData?.activeSubscription
    const canceledAt = activeSubscription?.canceledAt
      ? new Date(activeSubscription.canceledAt).getTime()
      : 0

    const isSubscriptionValid =
      activeSubscription?.status === 'active' ||
      (activeSubscription?.status === 'canceled' && canceledAt > today)

    const isAdmin = userStore.userData.role === 'admin'

    const hasPublishedPromotions = checkIfUserHasPromotions(eventStore.event)

    if (eventStore.event.eventType === 'promotion') {
      if ((isSubscriptionValid || isAdmin) && !hasPublishedPromotions) {
        const result = await eventStore.updateEventStatus(eventId, 'published')
        if (result) {
          router.push(`/events/${eventId}`)
        } else {
          console.error('Failed to publish promotion')
        }
      } else if (hasPublishedPromotions) {
        toast({
          description: t('userHasPromotions'),
          variant: 'destructive',
        })
      } else {
        router.push(
          `/subscription?id=${eventId}&type=${eventStore.event.eventType}`
        )
      }
    } else if (eventStore.event.eventType === 'event') {copyToClipboard
      router.push(`/payment?id=${eventId}&type=${eventStore.event.eventType}`)
    }
  } catch (error) {
    console.log('Error al publicar el evento:', error)
  }
}

const checkIfUserHasPromotions = (event) => {
  if (event.eventType === 'event') return false
  const hasPromotions = eventStore.events.filter(
    (event) =>
      event.eventType === 'promotion' &&
      event.status === 'published' &&
      event.userId?._id === userStore.userData?._id
  )
  if (hasPromotions.length === 0) return false
  if (hasPromotions._id === event._id) return false

  return true
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    toast({
      description: t('copyLink'),
    })
  } catch (err) {
    console.error('Error al copiar el enlace: ', err)
  }
}
</script>
