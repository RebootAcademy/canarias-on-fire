<template>
  <div class="flex flex-col gap-4 text-secondary">
    <!-- EVENT TYPE -->
    <hr v-if="!isEditing"/>
    <div v-if="!isEditing" class="flex flex-col">
      <p class="font-semibold">{{ $t('eventType') }}</p>
      <p class="text-xs mb-3">{{ $t('selectDateTime') }}</p>
      <EventTypeRadioGroup />
    </div>

    <!-- EVENT IMAGE -->
    <hr />
    <div class="flex flex-col gap-1">
      <p class="font-semibold">{{ $t('selectImage') }}</p>
      <p class="text-xs mb-2">
        {{ $t('selectImageDescription') }}
      </p>
      <ImageGallery store-type="event" />
      <p class="text-xs text-primary">{{ $t('availablePremium')}}</p>
      <div class="flex items-center gap-2 mt-2">
        <Info size="14" />
        <span class="text-sm text-gray-500">{{ $t('showMoreInfo')}}</span>
        <CustomDialog :title="$t('showPlans')" >
          <PaymentOptions 
            :payments="paymentStore.payments" 
          />
        </CustomDialog>
      </div>
    </div>

    <!-- EVENT NAME, DATE & TIME -->
    <hr />
    <div class="flex flex-col gap-1 w-full md:w-1/2">
      <p class="font-semibold">{{ $t('eventInfo') }}</p>
      <p class="text-xs text-gray-500 mb-2">{{ $t('eventInfoDescription') }}</p>
      <Label for="eventName" class="text-xs text-gray-500">
        {{ $t('eventNameLabel') }}
        <Input
          v-model="eventStore.eventName"
          id="eventName"
          type="text"
          class="p-2 border rounded-md mb-1"
        />
        <span 
          v-if="eventStore.hasTriedSubmit" 
          class="text-red-500 text-xs font-normal"
        >
          {{ errors.eventName }}
        </span>
      </Label>
    </div>
    <div
      v-if="eventStore.eventType === 'event'"
      class="flex w-full justify-between items-center p-3"
    >
      <div class="w-full flex xs:flex-col lg:flex-row  gap-4 ">
        <div class="w-full lg:w-[25%] flex flex-col ">
          <DatePicker v-model="endDate" :isEditing="isEditing" />
          <span 
            v-if="eventStore.hasTriedSubmit" 
            class="text-red-500 text-xs mt-1"
          >
            {{ errors.eventDate }}
          </span>
        </div>
        <div class="w-full flex">
          <div class="xs:w-1/2 md:w-[40%] lg:w-[20%] flex flex-col ">
            <TimePicker
              id="startTime"
              :label="$t('startTime')"
              modelValue="startTime"
            />
            <span 
              v-if="eventStore.hasTriedSubmit" 
              class="text-red-500 text-xs mt-1"
            >
              {{ errors.startTime }}
            </span>
          </div>
          <div class="xs:w-1/2 md:w-[40%] lg:w-[20%] flex flex-col ">
            <TimePicker
              id="endTime"
              :label="$t('endTime')"
              modelValue="endTime"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex w-1/2 justify-between items-center">
      <DateRangePicker />
    </div>

    <!-- EVENT DESCRIPTION -->
    <hr />
    <div class="flex flex-col gap-1 ">
      <p class="font-semibold">{{ $t('eventDescription') }}</p>
      <p class="text-xs text-gray-500 mb-2">
        {{ $t('eventDescriptionDescription') }}
      </p>
      <div class="w-full lg:w-2/3">
        <client-only>
          <QuillEditor 
            v-model:content="eventStore.eventDescription" 
            contentType="html" 
            theme="snow" 
            class="min-h-[200px]  border rounded-sm"
          />
        </client-only>
        <span 
          v-if="eventStore.hasTriedSubmit" 
          class="text-red-500 text-xs"
        >
          {{ errors.description }}
        </span>
      </div>
    </div>

    <!-- EVENT LOCATION -->
    <hr />
    <div class="flex flex-col w-full gap-1">
      <p class="font-semibold ">{{ $t('eventLocation') }}</p>
      <p v-if="!isEditing" class="text-xs text-gray-500 mb-2">
        {{ $t('eventLocationDescription') }}
      </p>
      <div class="w-full lg:w-2/3 ">
        <LocationSearch v-if="!changeMap" v-model="eventStore.eventLocation" :isEditing="isEditing"/>
        <div v-else>
          <span>{{ eventStore.eventLocation.address }}.</span>
          <span class="text-xs text-blue-400 cursor-pointer ml-2 hover:text-primary" @click="changeMap = false"> {{  $t('changeLocation') }} </span>
          <NuxtImg :src="eventStore.eventLocation.mapImageUrl" :alt="eventStore.eventLocation.address" class="w-full h-60 lg:h-[500px] object-cover mt-4" />
        </div>
      </div>
      <span 
        v-if="eventStore.hasTriedSubmit" 
        class="text-red-500 text-xs"
      >
        {{ errors.location }}
      </span>
    </div>

    
    <!-- EXTERNAL URL -->
    <hr />
    <div class="flex flex-col mb-6 w-full lg:w-2/3">
      <Label for="externalUrl" class="text-xs ml-1 mb-1">{{ $t('externalUrl') }}</Label>
      <Input
      v-model="eventStore.externalUrl"
      id="externalUrl"
      type="text"
      class="p-2 border rounded-md"
      />
    </div>


    <!-- EVENT PRICE & CAPACITY -->
    <hr />
    <p class="font-semibold">{{ $t('eventPrice') }}</p>
    <p class="text-xs text-gray-500 mb-2">
      {{ $t('eventPriceDescription') }}
    </p>

    <div class="flex justify-center sm:justify-start gap-4">
      <div 
        class="border-2 px-8 md:px-16 py-4 rounded-sm cursor-pointer"
        :class="isClickTypeOfPay && eventStore.isFree === true ? 'border-primary' : 'border-whiteGray'"
        @click="modifyTypeOfEvent(true)"
        >
        <p>{{ $t('buttons.free') }}</p>
      </div>
      <div 
        class="border-2 px-8 md:px-16 py-4 rounded-sm cursor-pointer"
        :class="isClickTypeOfPay && eventStore.isFree === false ? 'border-primary' : 'border-whiteGray'"
        @click="modifyTypeOfEvent(false)"
      >
        <p>{{ $t('buttons.pay') }}</p>
      </div>
    </div>
    <div v-show="eventStore.eventType === 'event' && isClickTypeOfPay || eventStore.isFree" class="flex flex-col gap-1">
      <div class="flex items-start gap-4">
        <div class="w-1/6">
          <PriceInput v-model="eventStore.eventPrice"  />
          <span 
            v-if="eventStore.hasTriedSubmit" 
            class="text-red-500 text-xs"
          >
            {{ errors.price }}
          </span>
        </div>
        <div class="w-1/6">
          <CapacityInput />
        </div>
      </div>
    </div>
  </div>
  <hr class="mb-4" />
</template>

<script setup>
import { Info } from 'lucide-vue-next'

import { errors, validateFields } from '../utils/validation'
const paymentStore = usePaymentStore()
const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  }
})
const changeMap = ref(props.isEditing)

const eventStore = useEventStore()
const { t, locale } = useI18n()

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
