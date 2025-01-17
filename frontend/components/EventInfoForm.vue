<template>
  <div class="flex flex-col gap-4 text-secondary text-lg">
    <!-- EVENT TYPE -->
    <hr v-if="!isEditing" />
    <div v-if="!isEditing" class="flex flex-col">
      <p class="font-semibold">{{ $t('eventType') }}</p>
      <p class="text-sm mb-3">{{ $t('selectDateTime') }}</p>
      <EventTypeRadioGroup />
    </div>

    <!-- EVENT IMAGE -->
    <hr />
    <div class="flex flex-col gap-1">
      <p class="font-semibold">{{ $t('selectImage') }}</p>
      <p class="text-sm mb-2">
        {{ $t('selectImageDescription') }}
      </p>
      <ImageGallery store-type="event" />
      <p class="text-sm text-primary">{{ $t('availablePremium') }}</p>
      <div class="flex items-center gap-2 mt-2">
        <Info size="14" />
        <span class="text-sm text-gray-500">{{ $t('showMoreInfo') }}</span>
        <CustomDialog :title="$t('showPlans')">
          <PaymentOptions
            v-if="eventStore.eventType === 'event'"
            :payments="paymentStore.payments"
          />
          <SubscriptionPlans
            v-else
            :plans="subscriptionStore.subscriptions"
            :isInformation="true"
          />
        </CustomDialog>
      </div>
    </div>

    <!-- EVENT NAME, DATE & TIME -->
    <hr />
    <div class="flex flex-col gap-1 w-full md:w-1/2">
      <p class="font-semibold">{{ $t('eventInfo') }}</p>
      <p class="text-sm text-gray-500 mb-2">{{ $t('eventInfoDescription') }}</p>
      <Label for="eventName" class="text-sm text-gray-500">
        {{ $t('eventNameLabel') }}
        <Input
          v-model="eventStore.eventName"
          id="eventName"
          type="text"
          class="p-2 border rounded-md mb-1"
        />
        <span
          v-if="eventStore.hasTriedSubmit"
          class="text-red-500 text-sm font-normal"
        >
          {{ errors.eventName }}
        </span>
      </Label>
    </div>
    <div
      v-if="eventStore.eventType === 'event'"
      class="flex w-full justify-between items-center"
    >
      <div class="w-full md:w-1/2 flex flex-col gap-4">
        <div class="w-full flex xs:flex-col lg:flex-row gap-4">
          <div class="w-full md:w-1/2 flex flex-col">
            <DatePicker v-model="endDate" :isEditing="isEditing" />
            <span
              v-if="eventStore.hasTriedSubmit"
              class="text-red-500 text-sm mt-1"
            >
              {{ errors.eventDate }}
            </span>
          </div>
          <div class="w-full md:w-1/2 flex flex-col">
            <div
              v-if="hasEndDate || (isEditing && eventStore.eventEndDate)"
              class="w-full flex flex-col"
            >
              <DatePicker
                v-model="endDate"
                :isEditing="isEditing"
                :endDate="true"
              />
              <span
                v-if="eventStore.hasTriedSubmit"
                class="text-red-500 text-sm mt-1"
              >
              </span>
            </div>
          </div>
        </div>
        <label class="flex items-center gap-2">
          <input type="checkbox" @click="hasEndDate = !hasEndDate" />
          <span class="text-sm text-gray-500">{{ $t('hasEndTime') }}</span>
        </label>
        <div class="w-full flex">
          <div class="xs:w-1/2 min-w-[94px] max-w-[140px] flex flex-col">
            <TimePicker
              id="startTime"
              :label="$t('startTime')"
              modelValue="startTime"
            />
            <span
              v-if="eventStore.hasTriedSubmit"
              class="text-red-500 text-sm mt-1"
            >
              {{ errors.startTime }}
            </span>
          </div>
          <div class="xs:w-1/2 min-w-[100px] max-w-[140px] flex flex-col">
            <TimePicker
              id="endTime"
              :label="$t('endTime')"
              modelValue="endTime"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- <div v-else class="flex sm:w-1/2 justify-between items-center">
      <DateRangePicker />
    </div> -->

    <!-- EVENT DESCRIPTION -->
    <hr />
    <div class="flex flex-col gap-1">
      <p class="font-semibold">{{ $t('eventDescription') }}</p>
      <p class="text-sm text-gray-500 mb-2">
        {{ $t('eventDescriptionDescription') }}
      </p>
      <div class="w-full lg:w-2/3">
        <client-only>
          <QuillEditor
            v-model:content="eventStore.eventDescription"
            toolbar="essential"
            contentType="html"
            theme="snow"
            class="min-h-[200px] border rounded-sm"
          />
        </client-only>
        <span v-if="eventStore.hasTriedSubmit" class="text-red-500 text-sm">
          {{ errors.description }}
        </span>
      </div>
    </div>

    <!-- EVENT LOCATION -->
    <hr />
    <div class="flex flex-col w-full gap-1">
      <p class="font-semibold">{{ $t('eventLocation') }}</p>
      <p v-if="!isEditing" class="text-sm text-gray-500 mb-2">
        {{ $t('eventLocationDescription') }}
      </p>
      <div class="w-full lg:w-2/3">
        <LocationSearch
          v-if="!changeMap"
          v-model="eventStore.eventLocation"
          :isEditing="isEditing"
        />
        <div v-else>
          <span>{{ eventStore.eventLocation.address }}.</span>
          <span
            class="text-sm text-blue-400 cursor-pointer ml-2 hover:text-primary"
            @click="changeMap = false"
          >
            {{ $t('changeLocation') }}
          </span>
          <NuxtImg
            :src="eventStore.eventLocation.mapImageUrl"
            :alt="eventStore.eventLocation.address"
            class="w-full h-60 lg:h-[500px] object-cover mt-4"
          />
        </div>
      </div>
      <span v-if="eventStore.hasTriedSubmit" class="text-red-500 text-sm">
        {{ errors.location }}
      </span>
    </div>

    <!-- EXTERNAL URL -->
    <hr />
    <div class="flex flex-col mb-4 w-full lg:w-2/3">
      <Label for="externalUrl" class="text-lg font-bold mb-1">{{
        $t('externalUrl')
      }}</Label>
      <p v-if="!isEditing" class="text-sm text-gray-500 mb-2">
        {{ $t('externalUrlDescription') }}
      </p>
      <Input
        v-model="eventStore.externalUrl"
        id="externalUrl"
        type="text"
        class="p-2 border rounded-md"
      />
    </div>

    <!-- EVENT PRICE & CAPACITY -->
    <div v-if="eventStore.eventType === 'event'" class="flex flex-col gap-2">
      <hr />
      <p class="font-semibold">{{ $t('eventPrice') }}</p>
      <p class="text-sm text-gray-500 mb-2">
        {{ $t('eventPriceDescription') }}
      </p>

      <div class="flex justify-center sm:justify-start gap-4">
        <div
          class="border-2 px-8 md:px-16 py-4 rounded-sm cursor-pointer"
          :class="
            isClickTypeOfPay && eventStore.isFree === true
              ? 'border-primary'
              : 'border-whiteGray'
          "
          @click="modifyTypeOfEvent(true)"
        >
          <p>{{ $t('buttons.free') }}</p>
        </div>
        <div
          class="border-2 px-8 md:px-16 py-4 rounded-sm cursor-pointer"
          :class="
            isClickTypeOfPay && eventStore.isFree === false
              ? 'border-primary'
              : 'border-whiteGray'
          "
          @click="modifyTypeOfEvent(false)"
        >
          <p>{{ $t('buttons.pay') }}</p>
        </div>
      </div>
    </div>
    <div
      v-show="
        (eventStore.eventType === 'event' && isClickTypeOfPay) ||
        (eventStore.eventType === 'event' && eventStore.isFree)
      "
      class="flex flex-col gap-1"
    >
      <div class="flex items-start gap-4">
        <div class="md:w-1/6">
          <PriceInput v-model="eventStore.eventPrice" />
          <span v-if="eventStore.hasTriedSubmit" class="text-red-500 text-sm">
            {{ errors.price }}
          </span>
        </div>
        <div v-if="eventStore.eventType === 'event'" class="w-1/2 md:w-1/6">
          <CapacityInput />
        </div>
      </div>
    </div>
    <div
      v-if="eventStore.eventType === 'promotion'"
      class="flex flex-col w-full gap-4 py-4"
    >
      <hr />
      <div class="w-full md:w-1/3">
        <p class="font-semibold mb-4">{{ $t('eventDiscount') }}</p>
        <CustomSelect
          v-model:selected="eventStore.eventDiscount"
          :items="eventDiscounts"
          :placeholder="$t('eventTypeDiscount.notSpecificied')"
        />
      </div>

      <hr />
      <div class="w-full md:w-1/3">
        <p class="font-semibold mb-4">{{ $t('eventCodePromo') }}</p>
        <div class="flex gap-4">
          <input type="checkbox" @click="checkCodePromo = !checkCodePromo"/>
          <p class="text-base">{{ $t('addEventCodePromo') }}</p>
        </div>
        <div v-if="checkCodePromo">
          <Input
            v-model="eventStore.eventCodePromo"
            :placeholder="$t('eventCodePromoPlaceholder')"
            id="eventCodePromo"
            type="text"
            class="p-2 border rounded-md w-full mt-4"
          />
          <span v-if="eventStore.hasTriedSubmit" class="text-red-500 text-sm">
            {{ errors.eventCodePromo }}
          </span>
        </div>

        
      </div>
    </div>
  </div>
  <hr class="mb-4" />
</template>

<script setup>
import { Info } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
import { errors, validateFields } from '../utils/validation'
const paymentStore = usePaymentStore()
const subscriptionStore = useSubscriptionStore()
const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const hasEndDate = ref(false)
const checkCodePromo = ref(false)
const changeMap = ref(props.isEditing)

const eventDiscounts = computed(() => {
   return [
    { label: t('onBoarding.step2Genres.all'), value: 'all' },
    { label: t('eventTypeDiscount.2x1'), value: '2x1' },
    { label: t('eventTypeDiscount.3x1'), value: '3x1' },
    { label: t('eventTypeDiscount.free'), value: 'free' },
    { label: t('eventTypeDiscount.other'), value: 'other' },
  ]
})

watch(
  () => hasEndDate.value,
  (newVal) => {
    if (newVal === false && eventStore.eventType === 'event') {
      eventStore.eventEndDate = eventStore.eventDate
    }
  }
)

const eventStore = useEventStore()

const isClickTypeOfPay = ref(false)

const modifyTypeOfEvent = (type) => {
  eventStore.isFree = type
  isClickTypeOfPay.value = true
}

onMounted(() => {
  if (props.isEditing && eventStore.event) {
    // Populate form fields with existing event data
    eventStore.eventName = eventStore.event.eventName
    eventStore.eventType = eventStore.event.eventType
    eventStore.eventDate = eventStore.event.eventDate
    eventStore.startTime = eventStore.event.startTime
    eventStore.endTime = eventStore.event.endTime
    eventStore.eventDiscount = eventStore.event.eventDiscount
    eventStore.eventDescription = eventStore.event.eventDescription
    eventStore.eventLocation = eventStore.event.eventLocation
    eventStore.eventPrice = eventStore.event.eventPrice
    eventStore.isFree = eventStore.event.isFree
    eventStore.eventCapacity = eventStore.event.eventCapacity
    eventStore.externalUrl = eventStore.event.externalUrl
    eventStore.eventImages = eventStore.event.eventImages
    eventStore.coverImage = eventStore.event.coverImage
  }
})
</script>

<style scoped>
input {
  accent-color: #f7931e;
}
</style>
