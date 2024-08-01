<template>
  <div class="flex flex-col mt-4 gap-4">
    <EventInfoForm :isEditing="isEditing" />
    <CategorySelector :isEditing="isEditing" />
    <Button type="submit" @click="onSubmit">{{ isEditing ? $t('update') : $t('preview') }}</Button>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'
import { useRouter } from 'vue-router'
import { errors, validateFields } from '../utils/validation'

const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  }
})

const eventStore = useEventStore()
const router = useRouter()
const { t } = useI18n()

const onSubmit = async () => {
  eventStore.setHasTriedSubmit(true)
  validateFields(t)
  if (Object.values(errors).every(error => error === '')) {
    if (props.isEditing) {
      await eventStore.updateEvent()
      router.push(`/events/${eventStore.event._id}`)
    } else {
      eventStore.status = 'draft'
      //eventStore.selectedCategories = eventStore.selectedCategories.map(category => category._id)
      router.push('preview')
    }
  }
}

</script>