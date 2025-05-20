<template>
  <div class="relative px-2 md:px-0 mt-4 bg-background text-secondary">
    <img
      :src="eventStore.event.coverImage || defaultImage"
      alt="Event Image"
      :class="`w-full h-[300px] md:h-[550px] rounded-md 
      ${(searchPaymentEvent !== 'basic' && 
        eventStore.event.coverImage) || 
        eventStore.event.externalSource ? 
        'object-cover' : 
        'object-contain'
      }`"
    />
    <div class="flex flex-col md:flex-row gap-2 justify-between md:px-8 mt-4">
      <div class="flex p-8 gap-2">
        <span
          v-for="category in event.categories"
          :key="category._id"
          class="bg-gray text-secondary text-xs font-semibold px-4 py-1 rounded-full"
        >
          {{ $t(`values.${category.name}`) }}
        </span>
      </div>
      <div
        class="flex sm:w-full md:w-auto justify-end items-center gap-2 mb-4 md:my-6 md:mr-6"
      >
        <div
          v-if="isOwner && event.status === 'published' && event.eventType === 'promotion'"
          class="cursor-pointer p-2 px-4 mr-4 text-center border-2 min-w-[215px] border-red-500 bg-red-500 rounded-md hover:font-bold hover:px-1 hover:bg-transparent hover:border-red-500"
          @click="isOpen = { status: true, type: 'cancel' }"
        >
          <p>{{ $t('cancelPromotionBTN')}}</p>
        </div>
        <div
          v-if="!isAdmin && isOwner && event.status === 'draft' && event.eventType === 'promotion' && event.userId.activeSubscription.status === 'inactive'"
          class="cursor-pointer p-2 px-4 mr-4 text-center border-2 min-w-[215px] border-primary bg-primary rounded-md hover:font-bold hover:px-1 hover:bg-transparent hover:border-primary"
          @click="() => handleSubscription(event.eventType)"
        >
          <p>{{ $t('subscribePromotionBTN')}}</p>
        </div>

        <Share2
          class="mr-2 w-8 cursor-pointer hover:text-primary"
          @click="share"
        />
        <Pencil
          v-if="isAdmin || isOwner"
          class="mr-2 w-8 cursor-pointer hover:text-primary"
          @click="editEvent"
        />
        <Trash
          v-if="isAdmin || isOwner"
          class="mr-2 w-8 cursor-pointer hover:text-red-500"
          @click="isOpen = { status: true, type: 'delete' }"
        />
      </div>
    </div>
    <div
      class="flex flex-col-reverse gap-4 sm:gap-0 sm:flex-row justify-between md:px-16 text-secondary"
    >
      <div class="flex flex-col gap-4 sm:w-3/5 md:w-4/5">
        <h1 class="text-3xl md:text-4xl font-bold text-primary">
          {{ event.eventName }}
        </h1>
        <div class="flex justify-between">
          <div class="flex flex-col gap-1 mt-2">
            <h2 class="text-2xl font-semibold mt-4">
              {{ event.eventType === 'event' ? $t('previewText.dateAndTime') : $t('previewText.author') }}
            </h2>
            <div v-if="event.eventType === 'event' && event.startTime" class="flex items-center gap-1">
              <Clock size="16" />
              <span>{{ event.startTime }} {{event.endTime ? '-' : ''}} {{ event.endTime }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Calendar v-if="event.eventType === 'event'" size="16" />
              <User v-else size="16" />
              <span>{{ 
                event.eventType === 'event' ? 
                formattedDate : (
                event.userId?.commercialName || 
                event.userId?.companyName || 
                event.userId?.username
                )}}
              </span>
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
          class="flex flex-col gap-2 my-"
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
            <img
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
        <div v-if="event.eventPrice" class="my-6">
          <TicketButton />
        </div>
        <div v-if="event.eventType === 'event' && event.eventCapacity" class="my-6">
          <h2 class="text-2xl font-semibold mt-4">
            {{ $t('previewText.capacity') }}
          </h2>
          <div class="flex items-center gap-1">
              <Users size="16" />
              <span>{{ event.eventCapacity }}</span>
            </div>
        </div>
        <div 
          v-if="event.externalSource"
          class="border border-primary w-fit p-2 rounded-md bg-primary"
        >
          <a
            target="_blank"
            rel="noopener noreferrer"
            :href="event.externalUrl"
            class="text-xl font-bold"
            :class="{
              'text-primary': isBasicPayment,
              'text-black': isGoldPayment || isPremiumPayment,
            }"
          >
            <h1>+ INFO</h1>
          </a>
        </div>
        <div v-if="event.eventCodePromo" class="flex flex-col gap-2">
          <h2 class="text-2xl font-semibold">{{ $t('eventCodePromo') }}</h2>
          <div
            class="border-2 border-whiteGray rounded-md w-fit cursor-pointer hover:bg-primary-gradient hover:text-white hover:border-primary"
            @click="copyCodePromo(event.eventCodePromo)"
          >
            <p class="text-whiteGrayfont-semibold p-2">
              {{ event.eventCodePromo.toUpperCase() }}
            </p>
          </div>
        </div>
        <div v-show="!isBasicPayment && !event.externalSource">
          <EventGallery />
        </div>
        <div class="flex gap-2 mt-6 mb-6">
          <div
            v-if="
              event.status === 'draft' && (isValidated || isAdmin) && isOwner
            "
            class="bg-primary-gradient p-0.5 rounded-md"
            @click="publishEvent"
          >
            <Button
              class="px-4 bg-background rounded-md text-secondary hover:text-white hover:bg-primary-gradient"
            >
              {{ $t('buttons.publish') }}
            </Button>
          </div>
        </div>
      </div>
      <!-- <div v-if="eventType === 'event'">
        <TicketButton hasBorder="hasBorder" />
      </div> -->
      <div v-if="eventType === 'promotion'">
        <DiscountSquare :event="event" />
      </div>
    </div>
  </div>
  <div class="px-8">
    <EventsRelated :type="eventType" />
  </div>
  <CustomModal v-model:open="isOpen.status">
    <p class="font-bold text-2xl">{{ $t('areYouSure') }}</p>
    <p v-if="isOpen.type === 'delete'" class="text-lg">
      {{ eventType === 'event' ? $t('deleteEvent') : $t('deletePromo') }}
    </p>
    <p v-else class="text-lg">{{ $t('cancelPromotion') }}</p>
    <div class="flex justify-end gap-4 mt-2">
      <button
        @click="isOpen = { status: false, type: null }"
        class="font-bold p-2 px-6 rounded-md bg-gray hover:bg-red-500"
      >
        {{ $t('buttons.cancel') }}
      </button>
      <CustomBtn
        v-if="isOpen.type === 'delete'"
        :title="$t('buttons.confirm')"
        @click="deleteEvent"
      />
      <CustomBtn v-else :title="$t('buttons.confirm')" @click="cancelPromo" />
    </div>
  </CustomModal>
</template>

<script setup>
import { Share2, Pencil, Trash, Clock, Calendar, MapPin, User, Users } from 'lucide-vue-next'
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


const isOpen = ref({
  status: false,
  type: null,
})

const eventType = computed(() => {
  return eventStore.event.eventType
})

const { event } = storeToRefs(eventStore)
const defaultImage = '/defaultImg.png'
const eventId = route.params.id
const isAdmin = userStore.userData?.role === 'admin'
const isValidated = userStore?.userData?.isValidated
const searchPaymentEvent = computed(() => {
  let payment = eventStore.events.find((e) => e._id === eventId)
  return payment?.payment?.name
})

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
  return eventStore.event?.userId?._id === userStore.userData?._id
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

const cancelPromo = async () => {
  try {
    await eventStore.updatePromotion(event.value._id, 'closed')
    toast({
      description: t('cancelPromotionToast'),
    })
    router.push('/')
  } catch (error) {
    toast({
      description: t('errorCancelPromotion'),
    })
  }
}

const formattedDate = computed(() => {
  if (eventStore.event.eventType === 'event') {
    return event.value?.eventEndDate
      ? formatEventDate(event.value?.eventDate) +
          ' - ' +
          formatEventDate(event.value?.eventEndDate)
      : formatEventDate(event.value?.eventDate)
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

    if (isAdmin) {
      const result = await eventStore.updateEventByAdmin(eventId)
      if (result) {
        router.push(`/events/${eventId}`)
      } else {
        console.error('Failed to publish promotion')
        toast({
          description: t('errorCreatingEvent'),
          variant: 'destructive'
        })
      }
    }

    if (eventStore.event.eventType === 'promotion') {
      if (isSubscriptionValid && !hasPublishedPromotions) {
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
    } else if (eventStore.event.eventType === 'event') {
      copyToClipboard
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

const share = () => {
  navigator.share({
    text: "Vente a este evento!",
    url: "evente.es/event/" + eventId
  })
}

const copyCodePromo = async (code) => {
  try {
    await navigator.clipboard.writeText(code)
    toast({
      description: t('copyCode'),
    })
  } catch (err) {
    console.error('Error al copiar el enlace: ', err)
  }
}

const handleSubscription = (type) => {
  router.push(`/pricing/${type === 'promotion' ? 'promotions' : 'events'}`)
}
</script>
