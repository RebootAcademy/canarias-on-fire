<template>
  <div v-if="bandNextPerformance" class="mt-8">
    <div v-if="!addNew" class="border-secondary border rounded-md p-4">
      <Label class="text-gray-300 font-bold text-lg">{{
        $t('NextPerformance')
      }}</Label>
      <div class="flex flex-col gap-1 mt-2">
        <p class="font-bold">{{ $t('eventLocation') }}:</p>
        <p>{{ userStore.userData?.nextPerformance?.location.address }}</p>
        <details>
          <summary class="text-primary">
            {{ $t('previewText.showMap') }}
          </summary>
          <NuxtImg
            :src="userStore.userData?.nextPerformance?.location.mapImageUrl"
            alt="Event Location"
            class="rounded-md h-60 lg:h-[300px] object-cover my-4"
          />
        </details>
        <div class="flex flex-row gap-6">
          <div class="flex flex-col">
            <p class="font-bold">{{ $t('eventDate') }}:</p>
            <p>{{ formattedDate }}</p>
          </div>
          <div class="flex flex-col">
            <p class="font-bold">{{ $t('startTime') }}:</p>
            <p>{{ userStore.userData?.nextPerformance?.startTime }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="addNew || !bandNextPerformance">
      <Label class="text-gray-300 font-bold text-lg">{{
        $t('addNextPerformance')
      }}</Label>
      <div class="flex flex-col gap-1 mt-2">
        <p>{{ $t('eventLocation') }}</p>
        <p class="text-xs text-gray-500 mb-2">
          {{ $t('eventLocationDescription') }}
        </p>
        <LocationSearch @locationChanged="handleLocationChange" />
      </div>
      <div class="w-full flex flex-row gap-2">
        <div class="w-1/2 md:w-2/3">
          <DatePicker :band="true" @dateChanged="handleDateChange" />
        </div>
        <div class="w-1/2 md:w-1/3">
          <TimePicker
            id="startTime"
            label="Start time"
            v-model="bandNextPerformance.nextPerformance.startTime"
          />
        </div>
      </div>
      <div class="flex justify-start mt-8">
        <CustomBtn title="Guardar" @click="handleUpdateNextPerformance" />
      </div>
    </div>
    <div v-if="!addNew" class="flex justify-start mt-8">
      <CustomBtn title="Añadir nueva actuación" @click="addNew = !addNew" />
    </div>
  </div>
</template>

<script setup>
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
const { t } = useI18n()
const userStore = useUserStore()

const performanceInStore = computed(() => {
  return userStore.userData?.nextPerformance
})

const bandNextPerformance = ref({
  nextPerformance: {
    date: '',
    location: '',
    startTime: '',
  },
})

const handleLocationChange = (locationData) => {
  bandNextPerformance.value.nextPerformance.location = locationData
}

const handleDateChange = (date) => {
  bandNextPerformance.value.nextPerformance.date = date
}

const handleUpdateNextPerformance = async () => {
  try {
    const dataToUpdate = {
      ...bandNextPerformance.value,
      _id: userStore.userData?._id,
    }
    const result = await userStore.updateUserProfile(dataToUpdate)
    if (result.success) {
      toast({
        description: t('updatedPerformance'),
      })
      console.log('result', result)
    } else {
      toast({
        description: t('errorPerformance'),
        variant: 'destructive',
      })
    }
  } catch (error) {
    console.error('Error updating profile:', error)
  } finally {
    addNew.value = false
  }
}

const addNew = ref(false)
const formattedDate = computed(() => {
  if (!userStore.userData.nextPerformance?.date) {
    return ''
  }
  const date = new Date(
    userStore.userData.nextPerformance?.date.year,
    userStore.userData.nextPerformance?.date.month - 1,
    userStore.userData.nextPerformance?.date.day
  )

  return date.toLocaleDateString()
})
</script>
