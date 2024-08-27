<template>
  <div class="flex flex-col mt-4 gap-4">
    <EventInfoForm :isEditing="isEditing" />
    <CategorySelector :isEditing="isEditing" />
    <Button type="submit" @click="onSubmit">{{ isEditing ? $t('update') : $t('preview') }}</Button>
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
      
      // Solo establecemos el payment si es un evento, no una promoción
      if (eventStore.eventType === 'event') {
        // router.push(`/payment?id=${eventId}&type=${eventType}`)
      }

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