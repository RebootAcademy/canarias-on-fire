<template>
  <div class="flex flex-col mt-4 gap-4">
    <EventInfoForm :isEditing="isEditing" />
    <CategorySelector :isEditing="isEditing" :type="eventStore.eventType" />
    <div class="flex w-full justify-end italic text-primary">
      <p v-if="!isValidated && !isAdmin">{{ $t('validateByAdmin') }}</p>
    </div>
    <div v-if="isAdmin && eventStore.eventType === 'event'" class="w-full md:w-1/3">
      <p class="font-semibold mb-4">{{ $t('adminPlan') }}</p>
      <CustomSelect
        v-model:selected="eventStore.adminPayment"
        :items="tariffItems"
        :placeholder="$t('chooseAdminPlan')"
      />
    </div>
    <div class="flex w-full justify-end items-center gap-4">
      <Button
        @click="router.push('/events')"
        class="bg-gray text-secondary px-6 p-5 hover:bg-red-300 hover:text-black"
        >{{ $t('buttons.cancel') }}</Button
      >
      <CustomBtn
        v-if="isValidated || isAdmin"
        :title="isEditing ? $t('buttons.update') : $t('buttons.preview')"
        :action="onSubmit"
      />
      <CustomBtn
        v-else
        :title="$t('buttons.save')"
        :action="onSaveAndRedirect"
        extraStyles="w-[110px]"
      />
    </div>
  </div>
</template>

<script setup>
import { errors, validateFields } from '../utils/validation'
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const tariffItems = computed(() => [
  {
    label: t('plansName.basic'),
    value: 'basic',
  },
  {
    label: t('plansName.optima'),
    value: 'optima',
  },
  {
    label: t('plansName.optimaPlus'),
    value: 'optima plus',
  },
])

const userStore = useUserStore()
const eventStore = useEventStore()
const router = useRouter()
const { t } = useI18n()

const isValidated = computed(() => userStore.userData.isValidated)
const isAdmin = computed(() => userStore.userData.role === 'admin')

const onSubmit = async () => {
  eventStore.setHasTriedSubmit(true)
  validateFields(t)
  if (Object.values(errors).every((error) => error === '')) {
    if (props.isEditing) {
      await eventStore.updateEvent()
      router.push(`/events/${eventStore.event._id}`)
    } else {
      eventStore.status = 'draft'
      eventStore.setUserId(userStore.userData._id)

      if (!checkIfUserHasPromotions(eventStore.event) || isAdmin) {
        const result = await eventStore.createEvent()
        if (result) {
          router.push(
            `/events/preview/${eventStore.event._id}?type=${eventStore.eventType}`
          )
        } else {
          console.error('Failed to create event')
        }
      } else {
        toast({
          description: t('userHasPromotions'),
          variant: 'destructive',
        })
      }
    }
  }
}

const onSaveAndRedirect = async () => {
  eventStore.setHasTriedSubmit(true)
  validateFields(t)
  if (Object.values(errors).every((error) => error === '')) {
    eventStore.status = 'draft'
    eventStore.setUserId(userStore.userData._id)
    const result = await eventStore.createEvent()
    if (result) {
      router.replace('/dashboard/events')
    } else {
      console.error('Failed to save event')
    }
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
</script>
