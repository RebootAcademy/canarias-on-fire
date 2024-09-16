<template>
  <div class="flex flex-col mt-4 gap-4">
    <EventInfoForm :isEditing="isEditing" />
    <CategorySelector :isEditing="isEditing" />
    <div class="flex w-full justify-end items-center gap-4">

      <CustomBtn :title="$t('buttons.cancel')" :withoutGradient="true" @click="router.push('/events')" />
      <CustomBtn :title="isEditing ? $t('update') : $t('preview')" :action="onSubmit" />
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

const onSubmit = async () => {
  eventStore.setHasTriedSubmit(true)
  // validateFields(t)
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

</script>