<template>
  <NuxtLink :to="`/events/${promotion._id}`">
    <div
      class="relative h-[380px] rounded-lg overflow-hidden group hover:border-2 hover:border-primary focus:border-4 focus:border-white"
      :class="{
        'bg-secondary-gradient text-black test-shine': isGoldPayment,
        'max-w-[300px]': isRelatedPromo,
      }"
    >
      <div
        class="absolute inset-0 rounded-lg border-primary border-[1px] shadow-[0_0_10px_rgba(234,88,12,0.5)] transition-all duration-300 hover:border-primary"
        :class="{
          'border-[rgba(234,88,12,0.5)] ': isBasicPayment,
          'border-primary': isGoldPayment,
        }"
      ></div>

      <div class="relative w-full h-full rounded-lg">
        <!-- Event status -->
        <span
          v-show="userStore.userData && userStore.userData.role === 'admin'"
          :class="[
            'absolute top-2 left-2 text-xs font-semibold bg-secondary rounded-xl px-2 py-1 text-background',
            { 'text-red-500 italic': promotion.status === 'draft' },
          ]"
        >
          {{ promotion.status }}
        </span>

        <!-- promotion Image -->
        <NuxtImg
          v-if="!isBasicPayment"
          :src="promotion.coverImage || defaultImage"
          class="w-full h-44 object-cover rounded-t-lg"
        />
        <NuxtImg
          v-else
          :src="defaultImage"
          class="ml-[1%] w-[98%] h-44 mt-[1%] object-contain rounded-t-lg z-0 bg-[#1a1a1a]"
        />
        <!-- Main content -->
        <div class="px-3 py-2 flex justify-between p-4">
          <!-- Categories -->
          <div class="flex flex-wrap gap-2">
            <span
              v-for="category in promotion.categories"
              :key="category._id"
              class="text-xs font-normal px-2.5 py-0.5 rounded-full self-center"
              :class="{
                'text-secondary': isBasicPayment,
                'text-secondary': isGoldPayment,
              }"
            >
              {{ category.name }}
            </span>
          </div>
          <!-- Options menu -->
          <div
            v-show="
              (userStore.userData && userStore.userData.role === 'admin') ||
              isOwner
            "
          >
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVertical
                  class="h-4 w-4 text-gray-500 hover:text-secondary"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem @select="editEvent" class="cursor-pointer">
                  <Pencil class="mr-2 h-4 w-4" />
                  <span>{{ $t('buttons.edit') }}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  @select="isOpen = true"
                  class="cursor-pointer"
                >
                  <Trash class="mr-2 h-4 w-4" />
                  <span>{{ $t('buttons.delete') }}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div class="flex flex-col justify-between items-start px-4">
          <h3 class="text-xl font-semibold mb-2">{{ promotion.eventName }}</h3>
          <p
            class="text-sm"
            :class="{
              'text-gray-300': isBasicPayment,
            }"
          >
            {{ formattedDate() }}
          </p>
          <!--  <div v-if="promotion.startTime" class="flex flex-row gap-2">
            <p
              v-if="promotion.startTime" 
              class="text-sm"
              :class="{
                'text-gray-300': isBasicPayment,
              }"> 
              {{  promotion.startTime }}
            </p>
            <p
              v-if="promotion.endTime" 
              class="text-sm"
              :class="{
                'text-gray-300': isBasicPayment,
              }"> 
              {{  promotion.endTime }} 
            </p>
          </div> -->

          <p class="text-sm line-clamp-1">
            {{ promotion.eventLocation.address }}
          </p>
          <div class="absolute bottom-3 text-sm font-semibold text-primary">
            <div
              class="flex flex-row gap-4 justify-between items-center w-full"
            >
              <div class="rounded-full bg-gray w-10 h-10"></div>
              <p :class="isBasicPayment ? 'text-primary' : 'text-secondary'">
                {{ promotion.userId.companyName }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
  <CustomModal v-model:open="isOpen">
    <p class="font-bold text-2xl">{{ $t('areYouSure') }}</p>
    <p class="text-lg">
      {{
        promotion.eventType === 'event' ? $t('deleteEvent') : $t('deletePromo')
      }}
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
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
const { t } = useI18n()
import { MoreVertical, Pencil, Trash } from 'lucide-vue-next'

const props = defineProps({
  promotion: {
    type: Object,
  },
  isRelatedPromo: {
    type: Boolean,
    default: false,
  },
})
const isOpen = ref(false)

const defaultImage = './defaultImg.png'
import { formatEventDate } from '@/utils/dateUtils'

const userStore = useUserStore()
const eventStore = useEventStore()
const router = useRouter()

const isOwner = computed(() => {
  return userStore.userData?._id === props.promotion.userId?._id
})

const formattedDate = () => {
  if (!props.promotion.eventDate) {
    return 'Date not available'
  }
  return `${formatEventDate(
    props.promotion.eventDate.start
  )} - ${formatEventDate(props.promotion.eventDate.end)}`
}

const editEvent = () => {
  router.push(`/events/edit/${props.promotion._id}`)
}

const deleteEvent = async () => {
  const success = await eventStore.deleteEvent(props.promotion._id)
  if (success) {
    toast({
      description:
        props.promotion.eventType === 'event'
          ? t('deleteEventSuccess')
          : t('deletePromoSuccess'),
    })
  } else {
    console.error('Failed to delete event')
  }
}

const getPaymentType = computed(() => {
  switch (props.promotion?.subscription?.name) {
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
</script>

<style scoped>
.test-shine:after {
  content: '';
  position: absolute;
  top: -50%;
  left: -60%;
  width: 20%;
  height: 200%;
  opacity: 0;
  transform: rotate(30deg);

  background: rgba(255, 255, 255, 0.13);
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.13) 0%,
    rgba(255, 255, 255, 0.13) 77%,
    rgba(255, 255, 255, 0.5) 92%,
    rgba(255, 255, 255, 0) 100%
  );
}

/* Hover state - trigger effect */
.test-shine:hover:after {
  opacity: 1;
  left: 130%;
  transition-property: left, top, opacity;
  transition-duration: 0.7s, 0.7s, 0.15s;
  transition-timing-function: ease;
}

/* Active state */
.test-shine:active:after {
  opacity: 0;
}
</style>
