<template>
  <NuxtLink :to="`/events/${event._id}`">
    <div
      class="relative h-[360px] rounded-lg overflow-hiddengroup hover:border-2 hover:border-primary focus:border-4 focus:border-secondary"
      :class="{
        'bg-[#FBB03B] text-black': isGoldPayment,
        'bg-primary-gradient text-black test-shine': isPremiumPayment,
        'bg-background': !isGoldPayment && !isPremiumPayment,
        'max-w-[300px]': isRelatedEvent,
      }"
    >
      <div
        class="absolute inset-0 rounded-lg border-2 shadow-[0_0_10px_rgba(234,88,12,0.5)] transition-all duration-300 hover:border-primary"
        :class="{
          'border-[rgba(234,88,12,0.5)] ': !isGoldPayment && !isPremiumPayment,
          'border-[#FBB03B]  ': isGoldPayment,
          'border-primary ': isPremiumPayment,
        }"
      ></div>

      <div class="relative  w-full h-full rounded-lg">
        <!-- Event status -->
        <span
          v-show="userStore.userData && (userStore.userData.role === 'admin' || isOwner)"
          :class="[
            'absolute top-2 left-2 text-xs font-semibold bg-secondary text-background rounded-xl px-2 py-1',
            { 'text-red-500 italic': event.status === 'draft' },
          ]"
        >
          {{ event.status }}
        </span>

        <!-- Event Image -->
        <NuxtImg
          v-if="!isBasicPayment"
          :src="event.coverImage || defaultImage"
          class="w-full h-44 object-cover rounded-t-lg "
        />
        <NuxtImg
          v-else
          :src="defaultImage"
          class="ml-[1%] w-[98%] h-44 mt-[1%] object-contain rounded-t-lg z-0 bg-[#1a1a1a]"
        />
        <!-- Main content -->
        <div class="px-4 py-2 flex justify-between">
          <!-- Categories -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="category in event.categories"
              :key="category._id"
              class="bg-gray text-secondary text-xs font-normal px-2.5 py-0.5 rounded-full self-center"
            >
              {{ category.name }}
            </span>
          </div>
          <!-- Options menu -->
          <div
            v-show="userStore.userData && (userStore.userData.role === 'admin' || isOwner)"
          >
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical
                  class="h-4 w-4 text-gray-500 hover:text-gray-700"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem @select="editEvent" class="cursor-pointer">
                  <Pencil class="mr-2 h-4 w-4" />
                  <span>{{ $t('buttons.edit') }}</span>
                </DropdownMenuItem>
                <DropdownMenuItem @select="isOpen = true" class="cursor-pointer">
                  <Trash class="mr-2 h-4 w-4" />
                  <span>{{ $t('buttons.delete') }}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div class="flex flex-col justify-between items-start px-4">
          <h3 class="text-xl text-secondary font-semibold mb-2">{{ event.eventName }}</h3>
          <p
            class="text-sm"
            :class="{
              ' text-secondary': isBasicPayment,
            }"
          >
            {{ formattedDate() }} at {{ event.startTime }} - {{ event.endTime }}
          </p>
          <p class="text-sm line-clamp-1">
            {{ event.eventLocation.address }}
          </p>
          <p
            class="absolute text-md font-semibold mt-2 bottom-2"
            :class="{
              'text-primary': isBasicPayment,
              'text-black': isGoldPayment || isPremiumPayment,
            }"
          >
            {{ event.eventPrice === 0 ? 'FREE' : `${event.eventPrice} €` }}
          </p>
        </div>
      </div>
    </div>
  </NuxtLink>
   <CustomModal v-model:open="isOpen">
    <p class="font-bold text-2xl">{{ $t('areYouSure') }}</p>
    <p class="text-lg">{{ event.eventType === 'event' ? $t('deleteEvent') : $t('deletePromo') }}</p>
    <div class="flex justify-end gap-4 mt-2">
      <!-- <CustomBtn :title="$t('buttons.confirm')" @click="deleteEvent" />  -->
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
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
import { MoreVertical, Pencil, Trash } from 'lucide-vue-next'
const { t } = useI18n()
const userStore = useUserStore()
const eventStore = useEventStore()
const router = useRouter()

const props = defineProps({
  event: Object,
  isRelatedEvent: {
    type: Boolean,
    default: false
  }
})

const isOpen = ref(false)

const isOwner = computed(() => {
  if (!userStore.userData || !eventStore.event.userId) return false
  return eventStore?.event?.userId._id === userStore.userData?._id
})

const defaultImage = './defaultImg.png'

const getPaymentType = computed(() => {
  switch (props.event.payment?.name) {
    case 'basic':
      return 'basic'
    case 'optima':
      return 'optima'
    case 'optima plus':
      return 'optima plus'
    default:
      return 'unknown'
  }
})

const isBasicPayment = computed(() => getPaymentType.value === 'basic')
const isGoldPayment = computed(() => getPaymentType.value === 'optima')
const isPremiumPayment = computed(() => getPaymentType.value === 'optima plus')

const editEvent = () => {
  router.push(`/events/edit/${props.event._id}`)
}

const deleteEvent = async () => {
  const success = await eventStore.deleteEvent(props.event._id)
  if (success) {
    toast({
    description:
      props.event.eventType === 'event'
        ? t('deleteEventSuccess')
        : t('deletePromoSuccess'),
  })
  } else {
    console.error('Failed to delete event')
  }
}

const formattedDate = () => {
  if (!props.event.eventDate) {
    return 'Date not available'
  }
  const { year, month, day } = props.event.eventDate
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

</script>

<style scoped>
  .test-shine:after {
    content: "";
    position: absolute;
    top: 0%;
    left: -20%;
    width: 20%;
    height: 120%;
    opacity: 0;
    transform: rotate(30deg);

    background: rgba(255, 255, 255, 0.13);
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.13) 0%,
      rgba(255, 255, 255, 0.13) 77%,
      rgba(255, 255, 255, 0.5) 92%,
      rgba(255, 255, 255, 0.0) 100%
    );
  }

  /* Hover state - trigger effect */
/*   .test-shine:hover:after {
    opacity: 1;
    left: 130%;
    transition-property: left, top, opacity;
    transition-duration: 0.7s, 0.7s, 0.15s;
    transition-timing-function: ease;
  } */

  /* Active state */
  .test-shine:active:after {
    opacity: 0;
  }
</style>
