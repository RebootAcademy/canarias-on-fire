<template>
  <div class="relative px-6 md:px-12 mt-4 bg-background text-secondary">
    <div
      @click="() => router.push(`/events/edit/${slug}`)"
      class="flex items-center max-w-[160px] rounded-md gap-2 my-4 left-4 cursor-pointer border-2 border-primary bg-background p-2 hover:bg-primary"
    >
      <ArrowLeft />
      <p>{{ $t('goEdit') }}</p>
    </div>
  <img
    :src="eventStore.event.coverImage || defaultImage"
    alt="Event Image"
    @click="toggleHeight"
    :class="[
      'w-full rounded-md object-cover cursor-pointer transition-all duration-300',
      isAutoHeight ? 'h-auto' : 'h-[300px] md:h-[550px]'
    ]"
  />
    <div class="lex flex-col md:flex-row gap-2 justify-between md:px-8 mt-4">
      <div class="flex p-8 gap-2">
        <span
          v-for="category in eventStore.selectedCategories"
          :key="category._id"
          class="bg-gray text-white text-xs font-semibold px-4 py-1 rounded-xl"
        >
          {{ category.name }}
        </span>
      </div>
      <div class="flex items-center gap-2 my-6 mr-6">
        <Share2 class="mr-2 w-8 cursor-pointer hover:text-primary" />
      </div>
    </div>
  </div>
  <div class="px-12">
    <h1 class="text-4xl font-bold">{{ eventStore.eventName }}</h1>
    <div class="flex items-center gap-4 mt-4 text-gray-600">
      <div v-if="eventStore.eventDate" class="flex items-center gap-1">
        <i class="far fa-calendar-alt"></i>
        <span>{{
          new Date(
            eventStore.eventDate.year,
            eventStore.eventDate.month - 1,
            eventStore.eventDate.day
          ).toLocaleDateString()
        }}</span>
      </div>
      <div v-if="eventStore.startTime" class="flex items-center gap-1">
        <i class="far fa-clock"></i>
        <span
          >{{ eventStore.startTime }} {{ eventStore.endTime ? '-' : '' }}
          {{ eventStore.endTime }}</span
        >
      </div>
      <div
        v-if="eventStore.eventType === 'event'"
        class="flex items-center gap-1"
      >
        <i class="fas fa-euro-sign"></i>
        <span>{{
          eventStore.eventPrice === 0 && eventStore.isFree !== 'not_available'
            ? $t('price.free')
            : eventStore.isFree === 'not_available'
            ? `${$t('eventPrice')}: ${$t('buttons.notAvailable')}`
            : `${eventStore.eventPrice}€`
        }}</span>
      </div>
      <p v-if="hasDayDiff" class="text-xs text-primary">
        {{ $t('previewText.extraCharge') }}
      </p>
    </div>
    <div class="mt-8">
      <h2 class="text-2xl font-semibold">{{ $t('previewText.aboutEvent') }}</h2>
      <div class="prose max-w-none" v-html="eventStore.eventDescription"></div>
    </div>
    <div class="flex flex-col gap-2 my-8">
      <h2 class="text-2xl font-semibold">{{ $t('eventLocation') }}</h2>
      <div class="flex gap-2">
        <MapPin size="20" />
        <p>{{ eventStore.eventLocation.address }}</p>
      </div>
      <details class="w-full lg:w-2/3">
        <summary class="text-primary">{{ $t('previewText.showMap') }}</summary>
        <img
          :src="eventStore.eventLocation.mapImageUrl"
          alt="Event Location"
          class="w-full h-60 lg:h-[500px] object-cover mt-4"
        />
      </details>
    </div>
    <div
      v-if="eventStore.eventType === 'promotion' && eventStore.eventDiscount"
      class="w-fit"
    >
      <DiscountSquare
        :event="{
          eventDiscount: eventStore.eventDiscount,
          categoriesOfServices: eventStore.categoriesOfServices,
        }"
      />
    </div>
    <div
      v-if="eventStore.eventType === 'event' && eventStore.musicType"
      class="w-fit"
    >
      <h2 class="text-2xl font-semibold">
        {{ $t(`musicType`) }}
      </h2>
      <p>
        {{ $t(`values.${eventStore.musicType}`) }}
      </p>
    </div>
    <div v-if="eventStore.eventCodePromo" class="flex flex-col gap-2">
      <h2 class="text-2xl font-semibold">{{ $t('eventCodePromo') }}</h2>
      <div
        class="border-2 rounded-md w-fit cursor-pointer hover:bg-primary-gradient hover:text-white hover:border-primary"
        @click="copyCodePromo(eventStore.eventCodePromo)"
      >
        <p class="font-semibold p-2">
          {{ eventStore.eventCodePromo.toUpperCase() }}
        </p>
      </div>
    </div>
    <div>
      <EventGallery />
      <p class="text-xs text-primary">
        {{ $t('previewText.featurePayedEvents') }}
      </p>
    </div>
    <Button
      @click="publishEvent"
      class="mt-8 bg-primary-gradient text-secondary hover:text-white"
      >{{ $t('buttons.publish') }}</Button
    >
    <Button
      @click="() => router.push(`/events/edit/${slug}`)"
      class="mt-8 ml-4 bg-background text-secondary border-2 border-primary hover:bg-primary hover:text-black"
      >{{ $t('goEdit') }}</Button
    >
  </div>
</template>

<script setup>
import { MapPin, ArrowLeft } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
const { t } = useI18n()
const userStore = useUserStore()
const eventStore = useEventStore()
const route = useRoute()
const router = useRouter()

const hasDayDiff = computed(() => localStorage.dayDiff)

const slug = route.params.slug
const defaultImage = '/defaultImg.png'
let eventId
onMounted(async () => {
  const { data, pending, error } = await eventStore.fetchEventBySlug(slug)
  eventId = data?._id
  eventStore.normalizeCategories()
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
        return router.push(`/events/${slug}`)
      } else {
        console.error('Failed to publish promotion')
        toast({
          description: t('errorCreatingEvent'),
          variant: 'destructive',
        })
      }
    }
    if (eventStore.event.eventType === 'promotion') {
      //Permitir la publicación de la promoción si no tiene publicaciones previas o está editando una existente (ya tiene un subscriptionId)
      if (
        isSubscriptionValid &&
        (!hasPublishedPromotions || eventStore.event.subscription)
      ) {
        const result = await eventStore.updateEventStatus(eventId, 'published')
        if (result) {
          await eventStore.fetchEvents()
          router.push(`/events/${slug}`)
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
  return hasPromotions.length > 0
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

const isAutoHeight = ref(false)

const toggleHeight = () => {
  isAutoHeight.value = !isAutoHeight.value
}
</script>
