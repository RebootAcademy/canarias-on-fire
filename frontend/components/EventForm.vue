<template>
  <div class="flex flex-col mt-4 gap-4">
    <EventInfoForm :isEditing="isEditing" />
    <CategorySelector :isEditing="isEditing" />
    <div class="flex w-full justify-end italic text-primary">
      <p v-if="!isValidated">* Para publicar el evento el organizador debe ser validado por el administrador</p>
    </div>
    <div class="flex w-full justify-end items-center gap-4">

      <CustomBtn :title="$t('buttons.cancel')" :withoutGradient="true" @click="router.push('/events')" />
      <CustomBtn v-if="isValidated"  :title="isEditing ? $t('update') : $t('preview')" :action="onSubmit" />
      <CustomBtn v-else  :title="$t('buttons.save')" :action="onSaveAndRedirect" extraStyles="w-[110px]"/>
    </div>
  </div>
</template>

<script setup>
import { errors, validateFields } from '../utils/validation'

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  }
})

const userStore = useUserStore()
const eventStore = useEventStore()
const router = useRouter()
const { t } = useI18n()

const isValidated = userStore.userData.isValidated

const onSubmit = async () => {
  eventStore.setHasTriedSubmit(true)
  validateFields(t)
  if (Object.values(errors).every(error => error === '')) {
    if (props.isEditing) {
      await eventStore.updateEvent()
      router.push(`/events/${eventStore.event._id}`)
    } else {
      eventStore.status = 'draft'
      eventStore.setUserId(userStore.userData._id)
      const result = await eventStore.createEvent()
      if (result) {
        router.push(`/events/preview/${eventStore.event._id}?type=${eventStore.eventType}`)
      } else {
        console.error('Failed to create event')
      }
    }
  }
}

const onSaveAndRedirect = async () => {
  //eventStore.setHasTriedSubmit(true)
  if (Object.values(errors).every(error => error === '')) {
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

</script>