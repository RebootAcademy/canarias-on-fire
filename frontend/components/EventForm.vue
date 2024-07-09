<template>
  <div class="flex flex-col mt-4 gap-4">
    <EventInfoForm />
    <CategorySelector />
    <Button type="submit" @click="onSubmit" >{{ $t('preview') }}</Button>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'
import { useRouter } from 'vue-router'
import { errors, validateFields } from '../utils/validation'

const eventStore = useEventStore()
const router = useRouter()
const { t } = useI18n()

const onSubmit = () => {
  eventStore.setHasTriedSubmit(true)
  eventStore.status = 'draft'
  validateFields(t)
  if (Object.values(errors).every(error => error === '')) {
    router.push('/event-preview')
  }
}

</script>