<template>
  <div class="flex flex-col mt-4 gap-4">
    <VeeForm v-slot="{ submitForm }" @submit="submitForm(onSubmit)" >
      <EventInfoForm />
      <CategorySelector />
      <VeeErrorMessage name="selectedCategories" class="text-red-500 text-xs" />
      <button type="submit" >{{ $t('preview') }}</button>
    </VeeForm>
  </div>
</template>

<script setup>
import { useEventStore } from '../stores/eventStore'
import { useRouter } from 'vue-router'
import { useForm, defineRule, configure } from 'vee-validate'
import { required } from '@vee-validate/rules'
import * as yup from 'yup'

const eventStore = useEventStore()
const router = useRouter()

defineRule('required', required)
/* defineRule('date_object', value => {
  if (typeof value === 'object' && value !== null) {
    const { year, month, day } = value
    const date = new Date(year, month - 1, day)
    return date instanceof Date && !isNaN(date.getTime()) ? true : 'Invalid date'
  }
  return 'Invalid date'
}) */

configure({
  generateMessage: context => {
    return `${context.field} required`
  }
})

const schema = yup.object({
  eventName: yup.string().required(),
  eventDescription: yup.string().required(),
  eventLocation: yup.string().required(),
  eventDate: yup.date().required(),
  startTime: yup.string().required(),
  endTime: yup.string().required(),
  eventPrice: yup.number().required()
})

/* const { handleSubmit, validate } = useForm({
  validationSchema: schema
}) */

const onSubmit = (values) => {
  eventStore.status = 'draft'
  console.log('Form data:', values)
  router.push({
    name: 'event-preview'
  })
}

</script>